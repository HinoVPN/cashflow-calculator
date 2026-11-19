<template>
  <Teleport to="body">
    <div
      class="modal fade"
      id="rateSettingsModal"
      tabindex="-1"
      aria-labelledby="rateSettingsModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="rateSettingsModalLabel">
              {{ t('rateSettings') }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              :aria-label="t('close')"
            ></button>
          </div>
          <div class="modal-body">
            <p class="text-secondary small mb-3">{{ t('rateDesc') }}</p>
            <div class="table-responsive">
              <table class="table table-sm align-middle mb-0">
                <thead>
                  <tr class="text-secondary small">
                    <th scope="col">{{ t('rateHeaderCurrency') }}</th>
                    <th scope="col">{{ t('rateHeaderValue') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="code in currencyCodes" :key="code">
                    <td class="fw-medium">{{ code }}</td>
                    <td>
                      <div class="input-group input-group-sm">
                        <span class="input-group-text">1 {{ code }} =</span>
                        <input
                          type="number"
                          step="0.0001"
                          class="form-control"
                          :value="financeStore.rates[code]"
                          :disabled="code === 'HKD'"
                          @input="onRateInput(code, $event.target.value)"
                        />
                        <span class="input-group-text">HKD</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-dark"
              data-bs-dismiss="modal"
            >
              {{ t('close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { useFinanceStore } from '../stores/financeStore';
import { useI18n } from '../i18n';

const financeStore = useFinanceStore();
const { t } = useI18n();

const currencyCodes = computed(() => Object.keys(financeStore.defaultRates));

let modalInstance = null;

const onRateInput = (code, value) => {
  financeStore.updateGlobalRate(code, value);
};

const show = () => {
  const el = document.getElementById('rateSettingsModal');
  if (!modalInstance) {
    modalInstance = new window.bootstrap.Modal(el);
  }
  modalInstance.show();
};

defineExpose({ show });
</script>
