<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">Tugas 3</a>
            <button
                class="navbar-toggler"
                type="button"
                data-mdb-toggle="collapse"
                data-mdb-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <i class="fas fa-bars"></i>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/product">Product</router-link>
                    </li>
                </ul>
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/checkout">
                            Checkout
                            <b-icon-cart></b-icon-cart>
                            <span class="badge badge-success ml-2">{{ totalCheckoutItems }}</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import {mapGetters} from "vuex";

export default {
    data() {
        return {
        };
    },
    computed: {
        ...mapGetters({
            totalCheckoutItems: 'getTotalCheckout'
        })
    },
    methods: {

    },
    mounted() {
        this.$store.dispatch('setTotalCheckout');
    }
}
</script>
