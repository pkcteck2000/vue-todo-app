<template>
  <div class="about pa-6">
    <h1>About Vuetify Todo</h1>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti,
      eveniet? Inventore accusamus dicta eum consequuntur fuga et, corrupti
      expedita sit unde asperiores soluta quis quas doloremque ipsa dignissimos
      ducimus aliquam. Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Corrupti, eveniet? Inventore accusamus dicta eum consequuntur fuga et,
      corrupti expedita sit unde asperiores soluta quis quas doloremque ipsa
      dignissimos ducimus aliquam. Lorem ipsum dolor sit amet consectetur
      adipisicing elit. Corrupti, eveniet? Inventore accusamus dicta eum
      consequuntur fuga et, corrupti expedita sit unde asperiores soluta quis
      quas doloremque ipsa dignissimos ducimus aliquam. Lorem ipsum dolor sit
      amet consectetur adipisicing elit. Corrupti, eveniet? Inventore accusamus
      dicta eum consequuntur fuga et, corrupti expedita sit unde asperiores
      soluta quis quas doloremque ipsa dignissimos ducimus aliquam.
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      headers: [
        {
          text: "Dessert (100g serving)",
          // filterable: true,
          value: "name",
        },
      ],
      desserts: [
        {
          name: "Frozen Yogurt",
        },
        {
          name: "Ice cream sandwich",
        },
      ],
    };
  },
};
</script>
