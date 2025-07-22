<template>
    <div class="flex h-screen">
        <div class="md:hidden fixed inset-0 z-10" v-if="showMenu" @click="showMenu = false"></div>
        <aside
            class="fixed left-0 top-0 h-screen w-[164px] transition-transform duration-300 md:translate-x-0 -translate-x-full z-20"
            :class="{ '-translate-x-full': !showMenu, 'translate-x-0': showMenu }">
            <div class="h-full w-full flex flex-col" style="box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25)">
                <div class="navigation">
                    <div
                        class="bg-[#ffffff] w-full flex flex-col items-center justify-start gap-[15px] shrink-0 w-[164px] relative">
                        <img class="shrink-0 w-[118px] h-10 relative" alt="" src="@/assets/images/logo.png" />

                        <!-- Menu items -->
                        <div class="flex flex-col gap-2.5 items-center justify-start shrink-0 relative">
                            <router-link to="/" exact-active-class="active-menu-item"
                                class="menu-item flex flex-col gap-1 items-center justify-start shrink-0 w-36 h-[88px] cursor-pointer">
                                <Icon icon="ph:squares-four"
                                    class="shrink-0 text-[#424242] w-[58px] h-[60px] relative object-cover" />
                                <div
                                    class="text-[#000000] text-left font-['Inter-Medium',_sans-serif] text-xs font-medium relative">
                                    DashBoard
                                </div>
                            </router-link>

                            <router-link to="/services" exact-active-class="active-menu-item"
                                class="menu-item flex flex-col gap-1 items-center justify-start shrink-0 w-36 h-[88px] cursor-pointer">
                                <Icon icon="ph:stack"
                                    class="shrink-0 text-[#424242] w-[58px] h-[60px] relative object-cover" />
                                <div
                                    class="flex-1 relative text-xs font-medium inline-block overflow-hidden text-ellipsis whitespace-nowrap h-[22px] flex items-center pl-[2px]">
                                    Services
                                </div>
                            </router-link>

                            <router-link to="/domains" exact-active-class="active-menu-item"
                                class="menu-item flex flex-col gap-1 items-center justify-start shrink-0 w-36 h-[88px] cursor-pointer">
                                <Icon icon="ph:globe"
                                    class="shrink-0 text-[#424242] w-[58px] h-[60px] relative object-cover" />
                                <div
                                    class="flex-1 relative text-xs font-medium inline-block overflow-hidden text-ellipsis whitespace-nowrap h-[22px] flex items-center pl-[2px]">
                                    Domains
                                </div>
                            </router-link>

                            <router-link to="/billing" exact-active-class="active-menu-item"
                                class="menu-item flex flex-col gap-1 items-center justify-start shrink-0 w-36 h-[88px] cursor-pointer">
                                <Icon icon="ph:credit-card"
                                    class="shrink-0 text-[#424242] w-[58px] h-[60px] relative object-cover" />
                                <div
                                    class="flex-1 relative text-xs font-medium inline-block overflow-hidden text-ellipsis whitespace-nowrap h-[22px] flex items-center pl-[2px]">
                                    Billing
                                </div>
                            </router-link>

                            <router-link to="/support" exact-active-class="active-menu-item"
                                class="menu-item flex flex-col gap-1 items-center justify-start shrink-0 w-36 h-[88px] cursor-pointer">
                                <Icon icon="ph:chat-circle-dots"
                                    class="shrink-0 text-[#424242] w-[58px] h-[60px] relative object-cover" />
                                <div
                                    class="flex-1 relative text-xs font-medium inline-block overflow-hidden text-ellipsis whitespace-nowrap h-[22px] flex items-center pl-[2px]">
                                    Support
                                </div>
                            </router-link>
                        </div>
                    </div>

                    <!-- Account section -->
                    <div class="flex flex-col gap-[34px] items-center justify-end shrink-0 h-[191px] relative">
                        <div
                            class="menu-item flex flex-col gap-1 items-center justify-start shrink-0 w-36 h-[88px] cursor-pointer">
                            <Icon icon="ph:user" class="shrink-0 w-[58px] h-[60px] relative object-cover" />
                            <div
                                class="text-[#000000] text-left font-['Inter-Regular',_sans-serif] text-xs font-normal relative">
                                My Account
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
        <div class="flex-1 flex flex-col items-start justify-start z-1 relative md:pl-[164px]">
            <div
                class="md:hidden flex items-center justify-between shadow-[0px_0px_2px_rgba(0,_0,_0,_0.25)] bg-darkslateblue-100 fixed top-0 left-0 right-0 z-30">
                <img class="ml-[15px] relative h-[43px] object-cover" alt="" src="@/assets/images/logo.png" />
                <button @click="showMenu = !showMenu"
                    class="flex items-center px-3 py-2 bg-darkslateblue-100 text-white hover:text-darkorange cursor-pointer transition-colors duration-300">
                    <svg v-if="!showMenu" class="fill-current h-5 w-5" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                    </svg>
                    <svg v-else class="fill-current h-5 w-5" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
                    </svg>
                </button>
            </div>
            <div class="main-content self-stretch flex-1 mt-[10px] md:mt-0">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import { useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import auth from '@/auth';
import instance from '@/axios';

export default {
    name: 'ResponsiveLayout',
    components: {
        Icon,
    },
    setup() {
        const router = useRouter();
        const showMenu = ref(false)
        const isSubmenuActive = ref(false)
        const isLoading = ref(true)

        const toggleSubmenu = () => {
            isSubmenuActive.value = !isSubmenuActive.value
        }

        onMounted(async () => {
            // Temporarily disabled authentication
            // await auth.fetchUserData();
            isLoading.value = false;
        })

        watch(() => auth.state.isLoading, (newValue) => {
            isLoading.value = newValue;
        });

        const logout = async () => {
            console.log('Logout clicked');
            try {
                auth.clearAuth();
                router.push('/');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        };

        return {
            showMenu,
            isSubmenuActive,
            toggleSubmenu,
            isLoading,
            logout
        }
    },
    computed: {
        userRole() {
            return auth.state.userRole;
        },
        userPermissions() {
            return auth.state.userPermissions;
        },
        userData() {
            return auth.state.userData;
        }
    },
    methods: {
        hasPermission(permission) {
            const result = this.userPermissions.includes(permission);
            return result;
        }
    }
}
</script>

<style scoped>
.navigation {
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    box-sizing: border-box;
    gap: 18px;
    overflow-y: auto;
}

/* Menu Item Styles */
.menu-item {
    background-color: transparent;
    transition: background-color 0.3s ease;
    border-radius: 4px;
}

.menu-item:hover {
    background-color: rgba(38, 102, 111, 0.13);
}

/* Active state styling */
.active-menu-item {
    background-color: rgba(38, 102, 111, 0.13);
}

.show {
    display: none;
}

@media (max-width: 767px) {
    .show {
        display: block;
    }
}

.main-content {
    z-index: 10;
}

/* Ensure proper cursor on interactive elements */
a,
button,
[role="button"],
.cursor-pointer {
    cursor: pointer !important;
}
</style>