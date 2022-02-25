<template>
  <div class="line-login">
    <header>
      <h1>Login with LINE</h1>
    </header>
    <section>
      <a href="#" @click="lineLogin">
        <img
          alt="Vue logo"
          width="80"
          height="80"
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.icon-icons.com%2Ficons2%2F846%2FPNG%2F512%2FLine_icon-icons.com_67183.png&f=1&nofb=1"
        />
      </a>
    </section>
    <section class="main">
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(name, key) in tokenResult" :key="key">
            <td>{{ key }}</td>
            <td>{{ name }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { postAuthToGetToken } from "@/apis/line-dev";
import JwtDecode from "jwt-decode";

type VueData = {
  accessCode?: string;
  tokenResult?: {
    access_token: string;
    expires_in: number;
    id_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
  };
};

export default Vue.extend({
  name: "component-line-login",
  data: (): VueData => ({
    accessCode: undefined,
    tokenResult: undefined,
  }),
  created() {
    this.setAccessCode();
  },
  methods: {
    async lineLogin() {
      const accessUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.VUE_APP_LINE_CLIENT_ID}&redirect_uri=${process.env.VUE_APP_LINE_CALLBACK_URL}&state=1234&scope=openid%20profile&nonce=hello`;
      window.open(accessUrl, "_self");
    },
    getAccessCode(): string | undefined {
      const url = window.location.origin + this.$route.path;
      if (url !== process.env.VUE_APP_LINE_CALLBACK_URL) return;
      const { code }: { code?: string } = this.$route.query;
      return code;
    },
    setAccessCode() {
      const code: string | undefined = this.getAccessCode();
      if (!code) return;
      this.accessCode = code;
      this.lineExchangeToken();
    },
    async lineExchangeToken() {
      if (!this.accessCode || this.accessCode === "") return;
      this.tokenResult = await postAuthToGetToken(this.accessCode);
      if (!this.tokenResult) return;
      console.log(JwtDecode(this.tokenResult["id_token"]));
    },
  },
});
</script>

<style scoped lang="scss">
.line-login {
  table {
    table-layout: fixed;
    border-collapse: collapse;
    width: 100%;
    border: 1px solid black;

    th {
      background-color: #c9d3b1;
      &:first-child {
        width: 200px;
      }
    }
    th,
    td {
      border: 1px solid #aaa;
      padding: 10px;
      word-break: break-all;
      text-align: left;
    }
  }
}
</style>
