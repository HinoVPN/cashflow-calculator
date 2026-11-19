<template>
  <header class="border-bottom bg-white">
    <div class="container py-4">
      <div class="d-flex flex-wrap align-items-start justify-content-between gap-3">
        <div>
          <h1 class="h3 mb-1 fw-semibold">{{ t('brand') }}</h1>
          <p class="text-secondary mb-0 small">{{ t('tagline') }}</p>
        </div>
        <div class="btn-group btn-group-sm" role="group" :aria-label="t('brand')">
          <button
            type="button"
            class="btn"
            :class="isZh ? 'btn-dark' : 'btn-outline-secondary'"
            @click="setLocale('zh-Hant')"
          >
            {{ t('langZh') }}
          </button>
          <button
            type="button"
            class="btn"
            :class="!isZh ? 'btn-dark' : 'btn-outline-secondary'"
            @click="setLocale('en')"
          >
            {{ t('langEn') }}
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from '../i18n';

const { t, setLocale, isZh } = useI18n();
</script>
