<template>
    <div class="page">
      <Header />
      <slot />
    </div>
</template>

<style lang="scss" scoped>
.page {
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}
</style>