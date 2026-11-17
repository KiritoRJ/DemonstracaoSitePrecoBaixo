import React, { useEffect } from 'react';
import { useSiteData } from '../context/SiteDataContext';

interface LocalSeoHeadProps {
  currentPage: 'home' | 'careers' | 'admin';
}

function upsertMeta(selector: string, attrName: 'name' | 'property', attrValue: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Invisible SEO head manager (zero visual changes):
 * - Sets canonical URL, og:url, and absolute social preview images
 * - Updates document title per public page
 * - Injects dynamic JobPosting JSON-LD for active open positions so Google Jobs indexes them
 */
export const LocalSeoHead: React.FC<LocalSeoHeadProps> = ({ currentPage }) => {
  const { jobs } = useSiteData();

  useEffect(() => {
    const origin = window.location.origin;
    const canonicalUrl = origin + window.location.pathname;

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    const shareImage = `${origin}/pb-assets/slide-ofertas-semana.webp`;
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', shareImage);
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', shareImage);

    if (currentPage === 'careers') {
      document.title = 'Trabalhe Conosco | Vagas de Emprego Preço Baixo Belém e Ananindeua';
    } else if (currentPage === 'admin') {
      document.title = 'Painel Interno | Preço Baixo Atacadista';
    } else {
      document.title = 'Preço Baixo Atacadista | Supermercado e Atacado em Belém e Ananindeua';
    }
  }, [currentPage]);

  useEffect(() => {
    const activeJobs = jobs.filter((j) => j.active);
    const scriptId = 'pb-jobs-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (activeJobs.length === 0) {
      if (scriptEl) scriptEl.remove();
      return;
    }

    const origin = window.location.origin;
    const jobGraph = activeJobs.map((job) => {
      const isAnanindeua = /br|cidade nova|icu[íi]|una/i.test(job.unit);
      const city = isAnanindeua ? 'Ananindeua' : 'Belém';
      return {
        '@type': 'JobPosting',
        title: job.title,
        description: `${job.description} Unidade: ${job.unit}. Escala: ${job.schedule}. Requisitos: ${job.requirements.join(', ')}.`,
        datePosted: job.createdAt.slice(0, 10),
        employmentType: /est[áa]gio/i.test(job.contractType)
          ? 'INTERN'
          : /tempor[áa]rio/i.test(job.contractType)
          ? 'TEMPORARY'
          : 'FULL_TIME',
        hiringOrganization: {
          '@type': 'Organization',
          name: 'Grupo Preço Baixo Atacadista',
          sameAs: origin,
        },
        jobLocation: {
          '@type': 'Place',
          address: {
            '@type': 'PostalAddress',
            addressLocality: city,
            addressRegion: 'PA',
            addressCountry: 'BR',
          },
        },
      };
    });

    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    scriptEl.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': jobGraph,
    });
  }, [jobs]);

  return null;
};
