<template>
    <section class="h-100 gradient-form" style="background-color: #eee;">
        <div class="container py-5 h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-xl-10">
                    <div class="card rounded-3 text-black">
                        <div class="row g-0">
                            <div class="col-lg-6">
                                <div class="card-body p-md-5 mx-md-4">

                                    <div class="text-center">
                                        <img
                                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                                            style="width: 185px;" alt="logo">
                                        <h4 class="mt-1 mb-5 pb-1">C-Mart</h4>
                                    </div>

                                    <form>
                                        <p>Please login</p>

                                        <div class="form-outline mb-4">
                                            <input v-model="email" type="email" id="form2Example11" class="form-control"
                                                   placeholder="Phone number or email address"/>
                                            <label class="form-label" for="form2Example11">Username</label>
                                        </div>

                                        <div class="form-outline mb-4">
                                            <input v-model="password" type="password" id="form2Example22" class="form-control"/>
                                            <label class="form-label" for="form2Example22">Password</label>
                                        </div>

                                        <div class="text-center pt-1 mb-5 pb-1">
                                            <button class="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                                                    type="button" @click="login">Log
                                                in
                                            </button>
                                        </div>

                                    </form>

                                </div>
                            </div>
                            <div class="col-lg-6 d-flex align-items-center gradient-custom-2">
                                <div class="text-white px-3 py-4 p-md-5 mx-md-4">
                                    <h4 class="mb-4">Cart Application</h4>
                                    <p class="small mb-0">Mudahkan pembelian barang kebutuhan anda</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from "axios";

export default {
    name: "LoginComponent",
    data() {
        return {
            email: "",
            password: ""
        };
    },
    methods: {
        login() {
            let bodyFormData = new FormData();
            bodyFormData.append('email', this.email);
            bodyFormData.append('password', this.password);
            axios({
                method: "post",
                url: "http://localhost:8000/api/auth/signin",
                data: bodyFormData
            }).then(response => {
                window.location.replace("http://localhost:8000/display");
            }).catch(error => {
                console.log(error);
            });
        },
    }
}
</script>

<style scoped>

</style>
