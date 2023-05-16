<template>
  <div>
    <h1>Anbindung der Anchor-Analytics Daten an OpenPodcast</h1>
    <p class="my-4">
      Um Anchor an OpenPodcast anzubinden, musst du dich bei Anchor anmelden.<br /><br />
      Die Zugangsdaten werden nicht gespeichert und dienen nur zur einmaligen
      Anbindung. Die Anbindung muss in regelmäßigen Abständen erneuert werden,
      wir informieren dich aber rechtzeitig.
    </p>
    <div class="w-1/2 border rounded-md border-gray-300 p-4">
      <div v-if="showSpinner">
        <div role="status">
          <span>{{ spinnerText }}</span>
          <svg
            aria-hidden="true"
            class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      </div>
      <div v-if="showForm">
        <div v-if="errorMsg">
          <p>{{ errorMsg }}</p>
        </div>
        <div>
          <input v-model="email" type="text" placeholder="Email Adresse" />
        </div>
        <div>
          <input
            v-model="password"
            placeholder="Passwort"
            :type="showPassword ? 'text' : 'password'"
          />
          <button class="ml-2">
            <template v-if="showPassword">
              <Icon
                name="material-symbols:visibility-off-rounded"
                @click="showPassword = !showPassword"
              />
              <span class="sr-only">Hide password</span>
            </template>
            <template v-else>
              <Icon
                name="material-symbols:visibility-rounded"
                @click="showPassword = !showPassword"
              />
              <span class="sr-only">Show password</span>
            </template>
          </button>
        </div>
        <button @click="login" class="blue">Anmelden</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      showSpinner: true,
      showForm: false,
      spinnerText: "Die Anmelde-Maske von Anchor wird geladen",
      errorMsg: "",
      showPassword: false,
    };
  },
  mounted() {
    // Simulate loading time
    setTimeout(() => {
      this.showSpinner = false;
      this.showForm = true;
    }, 2000);
  },
  methods: {
    login: async function () {
      if (!this.email || !this.password) {
        this.errorMsg = "Bitte gib deine Zugangsdaten vollständig ein.";
        return;
      }
      this.error = "";
      this.spinnerText = "Anchor wird an OpenPodcast angebunden";
      this.showForm = false;
      this.showSpinner = true;
      const response = await this.$axios.post(
        "http://localhost:3000/api/anchor",
        {
          email: this.email,
          password: this.password,
        }
      );
      // if response is 403 show form again and display error message
      if (response.status === 403) {
        this.showForm = true;
        this.showSpinner = false;
        this.errorMsg =
          "Dein Podcast konnte nicht angebunden werden, bitte überprüfe die angegebenen Zugangsdaten und versuche es erneut.";
      }
    },
  },
};
</script>

<style scoped>
input {
  @apply my-2 p-1 border rounded-md border-gray-300;
}
button.blue {
  @apply my-2 py-1 px-4 border rounded-md bg-blue-600 text-white font-bold;
}
</style>
