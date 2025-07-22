import { reactive } from "vue";
import instance from "@/axios";

const state = reactive({
    userRole: null,
    userPermissions: [],
    userData: {},
    isLoading: true,
    error: null,
});

export default {
    state,
    async fetchUserData() {
        state.isLoading = true;
        state.error = null;
        try {
            const response = await instance.get("auth-client/borrower");
            state.userData = response.data;
            state.userRole = response.data.edges.role[0] ? response.data.edges.role[0].name : null;
            state.userPermissions = response.data.edges.role[0] ? response.data.edges.role[0].edges.permissions.map(permission => permission.name) : [];
            // Store the JWT token in the userData object
            state.userData.token = response.data.token;

            console.log("User data:", state.userData.token);
        } catch (error) {
            state.error = error;
            this.clearAuth();
        } finally {
            state.isLoading = false;
        }
    },
    clearAuth() {
        state.userRole = null;
        state.userPermissions = [];
        state.userData = {};
        state.error = null;
    },
};