<template lang="pug">
.container
  .form
    h1.title Scrape web-page

    el-input.main-link(placeholder="Enter the link", v-model="form.mainLink")

    .separator-block(v-if="form.manyLinks.length")
      p.title Additional pages
      span.separator

    .added-links(v-for="(item, idx) in form.manyLinks")
      el-input.additional-link(
        placeholder="Enter the additional link",
        v-model="item.value"
      )

      el-button.delete-btn(
        type="danger",
        size="default",
        @click="handleDeleteLink(idx)"
      )
        i.el-icon-delete

    .btns
      el-button.item(@click="handleAddLink", type="success") Add link
      el-button.item(@click="handleSubmit", type="primary") Download
      el-button.item(@click="isValidHttpUrl()", type="primary") URL
</template>

<script>
export default {
  data() {
    return {
      form: {
        mainLink: "",
        manyLinks: [],
      },
    }
  },
  computed: {},
  methods: {
    isValidHttpUrl(string) {
      let url

      try {
        url = new URL(string)
      } catch (_) {
        return false
      }

      return url.protocol === "http:" || url.protocol === "https:"
    },
    handleSubmit() {
      const data = this.form
      this.$axios.$post("/scrape", data)
    },
    handleAddLink() {
      this.form.manyLinks.push({ value: "" })
    },
    handleDeleteLink(idx) {
      this.form.manyLinks.splice(idx, 1)
    },
  },
}
</script>

<style lang="scss">
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  .form {
    width: 35%;

    .main-link {
      width: 100%;
    }

    .title {
      padding-bottom: 20px;
      font-size: 25px;
      opacity: 0.5;
    }

    .separator-block {
      padding-top: 20px;

      .title {
        padding: 0;
        font-size: 16px;
        color: black;
        opacity: 0.3;
      }

      .separator {
        display: block;
        height: 1px;
        border: 0;
        border-top: 1px solid #ccc;
        margin: 1em 0;
        padding: 0;
      }
    }

    .btns {
      display: flex;
      padding-top: 30px;

      .item {
        // margin-top: 10px;
        width: 50%;
      }
    }

    .added-links {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      .additional-link {
      }

      .delete-btn {
        margin-left: 15px;
      }
    }
  }
}

/* .title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
} */
</style>
