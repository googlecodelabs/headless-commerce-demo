<template>
  <div class="sf-header__navigation desktop" v-if="!isMobile">
    <SfHeaderNavigationItem
      v-for="(category, index) in categories"
      :key="index"
      class="nav-item"
      v-e2e="`app-header-url_${category.slug}`"
      :label="category.name"
      :link="localePath(`/c/${category.slug}`)"
    />
  </div>
  <SfModal v-else :visible="isMobileMenuOpen">
    <SfHeaderNavigationItem
      v-for="(category, index) in categories"
      :key="index"
      class="nav-item"
      v-e2e="`app-header-url_${category.slug}`"
    >
      <template #mobile-navigation-item>
        <SfMenuItem
          :label="category.name"
          class="sf-header-navigation-item__menu-item"
          :link="localePath(`/c/${category.slug}`)"
          @click.native="toggleMobileMenu"
        />
      </template>
    </SfHeaderNavigationItem>
  </SfModal>
</template>

<script>
import { onSSR } from "@vue-storefront/core";
import { computed } from "@vue/composition-api";
import { SfMenuItem, SfModal } from "@storefront-ui/vue";
import { useUiState } from "~/composables";
import { useCategory } from "@vue-storefront/commercetools";

export default {
  name: "HeaderNavigation",
  components: {
    SfMenuItem,
    SfModal
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const { isMobileMenuOpen, toggleMobileMenu } = useUiState();
    const { categories: allCategories, search, loading } = useCategory(
      "menu-categories"
    );

    onSSR(async () => {
      await search({});
    });

    const categories = computed(() =>
      allCategories.value
        .filter(c => !c.parent)
        .sort((a, b) => (a.name > b.name ? 1 : -1))
    );

    return {
      categories,
      isMobileMenuOpen,
      toggleMobileMenu
    };
  }
};
</script>

<style lang="scss" scoped>
.sf-header-navigation-item {
  ::v-deep &__item--mobile {
    display: block;
  }
}
.sf-modal {
  ::v-deep &__bar {
    display: none;
  }
  ::v-deep &__content {
    padding: var(--modal-content-padding, var(--spacer-base) 0);
  }
}
</style>
