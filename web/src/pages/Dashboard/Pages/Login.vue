<template>
  <div class="md-layout text-center">
    <div
      class="
        md-layout-item
        md-size-33
        md-medium-size-50
        md-small-size-70
        md-xsmall-size-100
      "
    >
    <form name="form" @submit.prevent="handleLogin">
      <login-card header-color="green">
        <h4 slot="title" class="title">Log in</h4>
        <!-- <md-button
          slot="buttons"
          href="#facebook"
          class="md-just-icon md-simple md-white"
        >
          <i class="fab fa-facebook-square"></i>
        </md-button>
        <md-button
          slot="buttons"
          href="#twitter"
          class="md-just-icon md-simple md-white"
        >
          <i class="fab fa-twitter"></i>
        </md-button>
        <md-button
          slot="buttons"
          href="#google"
          class="md-just-icon md-simple md-white"
        >
          <i class="fab fa-google-plus-g"></i>
        </md-button> -->
        <md-field class="md-form-group" slot="inputs">
          <md-icon>face</md-icon>
          <label>Username...</label>
          <md-input v-model="user.username"></md-input>
        </md-field>
        <md-field class="md-form-group" slot="inputs">
          <md-icon>lock_outline</md-icon>
          <label>Password...</label>
          <md-input v-model="user.password"></md-input>
        </md-field>
        <div class="alert alert-primary" v-if="message">
          <button type="button" aria-hidden="true" class="close">×</button>
          <span> {{ message }}</span>
        </div>
        <md-button slot="footer" class="md-simple md-success md-lg">
          Login
        </md-button>
      </login-card>
    </form>
    </div>
  </div>
</template>
<script>
import { LoginCard } from "@/components";
import User from '@/models/user';

export default {
  components: {
    LoginCard,
  },
  data() {
    return {
      user: new User('', ''),
      loading: false,
      message: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      // this.$router.push('/profile');
      this.$router.push('/pages/user');
    }
  },
  methods: {
    handleLogin() {
      this.loading = true;        
      // this.$validator.validateAll().then(isValid => {
      //   if (!isValid) {
      //     this.loading = false;
      //     return;
      //   }
        if (this.user.username && this.user.password) {
          this.$store.dispatch('auth/login', this.user).then(
            () => {
              this.$router.push('/pages/user');
            }).catch(error => {
              this.loading = false;
              
              this.message =
                error.message || (error.response && error.response.data) ||
                error.toString()});

              alert("Loi login" + this.message);
        }
      // });
    }
  }
};
</script>

<style></style>
