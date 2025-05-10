<script setup lang="ts">
defineProps<{
  text: string,
  type: 'primary' | 'disabled' | null
  variant: 'bordered' | null
}>()

</script>

<template>
  <button class="button" :class="[type, variant]"> {{text}} </button>
</template>

<style scoped>
.button {
  width: 150px;
  height: 40px;
  padding: 0.25rem 0;

  outline: none;
  border: none;
  border-radius: 12px;

  font-size: 1rem;
  font-weight: 300;

  background: #3f3f46;
  color: #fff;
}

.button.bordered {
  border: 2px solid #3f3f46;
  color: #3f3f46;
  background: none;
}

.button.primary {
  background: #006fee;
  color: #fff;
}

.button.primary.bordered {
  border: 2px solid #006fee;
  background: none;
  color: #006fee;
}
</style>
