// src/instagram/instagram.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class InstagramService {
  // === 1) DUMMY DATA SET === //

  private dummyPostsMap: Record<string, any> = {
    C8abcXYZ12_: {
      id: '17958712345678901',
      shortcode: 'C8abcXYZ12_',
      url: 'https://www.instagram.com/p/C8abcXYZ12_/',
      caption: 'Mi post usando dummies 👀',
      mediaType: 'IMAGE',
      imageUrl: 'https://picsum.photos/600/600',
      timestamp: '2024-12-01T12:30:00+0000',
      likeCount: 145,
      commentsCount: 12,
      insights: null,
    },

    C9xyzAABBCC: {
      id: '17999500112233445',
      shortcode: 'C9xyzAABBCC',
      url: 'https://www.instagram.com/p/C9xyzAABBCC/',
      caption: 'Post de prueba para estadísticas 📊',
      mediaType: 'IMAGE',
      imageUrl: 'https://picsum.photos/600/800',
      timestamp: '2025-01-10T09:20:00+0000',
      likeCount: 320,
      commentsCount: 44,
      insights: {
        reach: 2800,
        impressions: 3200,
        saved: 65,
        shared: 12,
      },
    },

    DA12345EFGH: {
      id: '17988776655443322',
      shortcode: 'DA12345EFGH',
      url: 'https://www.instagram.com/p/DA12345EFGH/',
      caption: 'Test realista con datos simulados para dev 🔥',
      mediaType: 'CAROUSEL_ALBUM',
      imageUrl: 'https://picsum.photos/700/700',
      timestamp: '2025-02-08T16:50:00+0000',
      likeCount: 890,
      commentsCount: 104,
      insights: {
        metrics: [
          { name: 'reach', values: [{ value: 5400 }] },
          { name: 'impressions', values: [{ value: 6200 }] },
          { name: 'saved', values: [{ value: 230 }] },
          { name: 'shares', values: [{ value: 48 }] },
        ],
      },
    },
  };

  // === 2) EXTRAER SHORTCODE === //

  private extractShortcode(url: string): string | null {
    const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([^/?]+)/);
    return match ? match[1] : null;
  }

  // === 3) PREVIEW POST — CONSERVAR TAL CUAL === //

  async previewPost(postUrl: string) {
    const shortcode = this.extractShortcode(postUrl);

    if (!shortcode) {
      throw new HttpException(
        'URL de post de Instagram inválida',
        HttpStatus.BAD_REQUEST,
      );
    }

    const dummy = this.dummyPostsMap[shortcode];

    if (!dummy) {
      throw new HttpException(
        `No existe dummy para shortcode ${shortcode}. Probá con uno de: ${Object.keys(
          this.dummyPostsMap,
        ).join(', ')}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return dummy; // respuesta idéntica a Instagram
  }

  // === 4) NUEVO: GET STATS POR MEDIA ID (STREAMLIT) === //

  getStats(mediaId: string) {
    // buscamos por mediaId en vez de shortcode
    const post = Object.values(this.dummyPostsMap).find(
      (p: any) => p.id === mediaId,
    );

    if (!post) {
      throw new HttpException(
        `No existe dummy con mediaId ${mediaId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    // métricas iniciales
    let reach = 0;
    let saves = 0;
    let shares = 0;

    // Caso insights simple (dummy 2)
    if (post.insights?.reach) {
      reach = post.insights.reach;
      saves = post.insights.saved ?? 0;
      shares = post.insights.shared ?? 0;
    }

    // Caso insights estilo Meta (dummy 3)
    if (Array.isArray(post.insights?.metrics)) {
      for (const metric of post.insights.metrics) {
        if (metric.name === 'reach') reach = metric.values?.[0]?.value ?? 0;
        if (metric.name === 'saved') saves = metric.values?.[0]?.value ?? 0;
        if (metric.name === 'shares') shares = metric.values?.[0]?.value ?? 0;
      }
    }

    // followers dummy por ahora
    const followers = 15000;

    return {
      id: post.id,
      shortcode: post.shortcode,
      likeCount: post.likeCount,
      commentsCount: post.commentsCount,
      reach,
      saves,
      shares,
      followers,
    };
  }
}
