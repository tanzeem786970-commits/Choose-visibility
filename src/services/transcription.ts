import { s3Service } from './s3';
import { db } from '@/lib/supabase';

export interface TranscriptionResult {
  text: string;
  language?: string;
  duration?: number;
}

export async function transcribeAudio(file: File, language?: string, userId?: string): Promise<TranscriptionResult> {
  try {
    // Upload file to S3 (via presigned URL) and request server-side transcription
    let s3Key = '';
    if (userId) {
      const uploadResult = await s3Service.uploadFile(file, userId);
      s3Key = uploadResult.key;
    }

    const formData = new FormData();
    if (s3Key) formData.append('s3Key', s3Key);
    else formData.append('file', file);
    if (language && language !== 'auto') formData.append('language', language);
    if (userId) formData.append('userId', userId);

    // Call backend transcription endpoint (server should hold OPENAI_API_KEY)
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error(`Transcription failed: ${response.statusText}`);
    const data = await response.json();

    // Update user minutes used if userId provided
    if (userId && data.duration) {
      try {
        const userData = await db.getUser(userId);
        const minutesToAdd = Math.ceil(data.duration / 60); // Convert seconds to minutes
        const newMinutesUsed = (userData.minutes_used || 0) + minutesToAdd;
        await db.updateUserMinutes(userData.id, newMinutesUsed);
      } catch (updateError) {
        console.error('Error updating user minutes:', updateError);
        // Don't fail the transcription if update fails
      }
    }

    // Send completion email if user ID is provided
    if (userId && data.text) {
      try {
        // Note: In a real implementation, you'd get the user's email from the database
        // For now, we'll skip the email as we don't have the email here
        // emailService.sendTranscriptionCompleteEmail(userEmail, file.name, data.text.length);
      } catch (emailError) {
        console.error('Error sending completion email:', emailError);
      }
    }

    return {
      text: data.text,
      language: data.language,
      duration: data.duration,
    };
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}