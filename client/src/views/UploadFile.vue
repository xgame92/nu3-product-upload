<template>
  <b-container class="bv-example-row">
    <b-row class="justify-content-md-center">
      <b-col cols="6">
        <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
          <!-- Styled -->
          <b-form-file
              accept=".csv, .xml"
              v-model="form.uploadedFile"
              placeholder="Choose a file or drop it here..."
              drop-placeholder="Drop file here..."
          ></b-form-file>

          <div class="mt-3">Selected file: {{ form.uploadedFile ? form.uploadedFile.name : '' }}</div>

          <b-form-group id="input-group-4" v-slot="{ ariaDescribedby }">
            <b-form-checkbox-group
                v-model="form.checked"
                id="checkboxes-4"
                :aria-describedby="ariaDescribedby"
            >
            </b-form-checkbox-group>
          </b-form-group>

          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
        <b-card class="mt-3" header="Uploaded Files">
          <b-table striped hover :items="uploadedFiles" :fields="fields">
            <!-- A custom formatted column -->

            <template #cell(originalFileName)="data">
              <b class="text-dark" @click="downloadFile(data.item.fileName)">{{ data.value }}</b>
            </template>
            <!-- A custom formatted column -->
            <template #cell(createdAt)="data">
              <b class="text-info">{{ new Date(data.value).toLocaleDateString() }} ||
                {{ new Date(data.value).toLocaleTimeString() }}</b>
            </template>

          </b-table>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
  name: 'UploadFile',
  data() {
    return {
      form: {
        uploadedFile: [],
      },
      fields: [
        {key: 'originalFileName', label: 'File Name'},
        {key: 'createdAt', label: 'Upload Date'}
      ]
    }
  },
  computed: {
    ...mapState('file', ['uploadedFiles'])
  },
  mounted() {
    this.getUploadedFiles();
  },
  methods: {
    ...mapActions('file', [
      'uploadFile',
      'getUploadedFiles'
    ]),
    onSubmit() {
      let bodyFormData = new FormData();
      bodyFormData.append('file', this.form.uploadedFile);
      this.form.uploadedFile = [];
      this.uploadFile(bodyFormData);
    },
    onReset() {
      this.form.uploadedFile = [];
    },
    downloadFile(fileName) {
      window.open(
          process.env.VUE_APP_API_SERVER_URL +
          `/v1/products/file/${fileName}`
      )
    }
  }
}
</script>

<style lang="scss">
</style>
