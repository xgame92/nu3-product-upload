import Vue from "vue";
import Swal from "sweetalert2";

// state
export const state = {
    uploadedFiles:[]
}

// getters
export const getters = {
}

// mutations
export const mutations = {
    setUploadedFiles(state, files) {
        state.uploadedFiles = files;
    }
}

// actions
export const actions = {
    async getUploadedFiles({commit, dispatch}, file) {
         Vue.$axios.get('/v1/products/files')
            .then(function (response) {
                commit('setUploadedFiles', response.data.reverse())
            })
            .catch(function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.response.data.message,
                    reverseButtons: true,
                    confirmButtonText: 'Ok',
                    cancelButtonText: 'Cancel'
                })
            })
    },
    async uploadFile({commit, dispatch}, file) {
        Vue.$axios.post(`/v1/products/upload`, file)
            .then(function (response) {

                dispatch('getUploadedFiles');

                Swal.fire({
                    icon: 'success',
                    title: 'Succes',
                    text: 'Uploaded Succesfully',
                    reverseButtons: true,
                    confirmButtonText: 'Ok',
                    cancelButtonText: 'Cancel'
                })
            })
            .catch(function (error) {
                if(error.response.status == '415'){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.response.data.message,
                        reverseButtons: true,
                        confirmButtonText: 'Ok',
                        cancelButtonText: 'Cancel'
                    })
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Internal Server Error',
                        reverseButtons: true,
                        confirmButtonText: 'Ok',
                        cancelButtonText: 'Cancel'
                    })
                }
            });
    }
}
