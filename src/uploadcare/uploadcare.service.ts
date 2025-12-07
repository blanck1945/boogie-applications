// src/uploadcare/uploadcare.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  listOfFiles,
  UploadcareSimpleAuthSchema,
} from '@uploadcare/rest-client';
import axios from 'axios';

@Injectable()
export class UploadcareService {
  private auth: UploadcareSimpleAuthSchema;

  constructor(private config: ConfigService) {
    this.auth = new UploadcareSimpleAuthSchema({
      publicKey: this.config.get<string>('UPLOADCARE_PUBLIC_KEY') || '',
      secretKey: this.config.get<string>('UPLOADCARE_SECRET_KEY') || '',
    });
  }

  // 🔥 1. Listar buckets simulados (agrupados por metadata.bucket)
  async listBuckets() {
    const data = await listOfFiles(
      {
        limit: 200, // podés paginar más adelante si tenés muchos archivos
        stored: true,
        ordering: '-datetime_uploaded',
      },
      { authSchema: this.auth },
    );

    // Agrupamos por metadata.bucket
    const buckets: Record<string, number> = {};

    for (const file of data.results) {
      const bucket = file.metadata?.bucket ?? 'default';

      if (!buckets[bucket]) buckets[bucket] = 0;
      buckets[bucket]++;
    }

    return Object.entries(buckets).map(([name, totalFiles]) => ({
      name,
      totalFiles,
    }));
  }

  // 🔥 2. Listar archivos de un bucket
  async listFilesByBucket(bucket: string) {
    const data = await listOfFiles(
      {
        limit: 200,
        stored: true,
        ordering: '-datetime_uploaded',
      },
      { authSchema: this.auth },
    );

    const files = data.results.filter(
      (f) => (f.metadata?.bucket ?? 'default') === bucket,
    );

    return {
      bucket,
      files: files.map((f) => ({
        uuid: f.uuid,
        filename: f.originalFilename,
        size: f.size,
        cdnUrl: f.originalFileUrl || f.url,
        uploadedAt: f.datetimeUploaded,
      })),
    };
  }

  // 🔥 3. Asignar bucket (metadata[bucket]) a un archivo
  async assignBucket(uuid: string, bucket: string) {
    const url = `https://api.uploadcare.com/files/${uuid}/metadata/bucket/`;

    await axios.put(url, JSON.stringify(bucket), {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.uploadcare-v0.7+json',
        Authorization: `Uploadcare.Simple ${this.config.get(
          'UPLOADCARE_PUBLIC_KEY',
        )}:${this.config.get('UPLOADCARE_SECRET_KEY')}`,
      },
    });

    return { ok: true };
  }
}
