<template>
  <b-row class="justify-content-md-center">
    <b-col cols="6">
      <h1>
        Nu3.de Product and Inventory Update SPA
      </h1>
      <b-button variant="outline-info" class="mb-2" @click="gitHubLogin">
        <b-icon icon="github" aria-hidden="true"></b-icon> Login
      </b-button>
    </b-col>
  </b-row>
</template>

<script>

export default {
  name: 'Home',
  components: {
  },
  methods: {
    gitHubLogin : function (){
      window.location = `${process.env.VUE_APP_API_SERVER_URL}/auth/github`;
    },
    login: function () {
      this.$store.auth.login({ email, password }).then(function () {
        // Execute application logic after successful login
      })
    },
    authenticate: function (provider) {
      this.$auth.authenticate(provider).then(function () {
        // Execute application logic after successful social authentication
      })
    },
    register: function () {
      this.$auth.register({ name, email, password }).then(function () {
        // Execute application logic after successful registration
      })
    }
  }
}
</script>
