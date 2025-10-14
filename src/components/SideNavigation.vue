<template>
    <div class="flex h-screen">
        <div class="md:hidden fixed inset-0 z-10" v-if="showMenu" @click="showMenu = false"></div>

        <!-- Compact Sidebar -->
        <aside
            class="fixed left-0 top-0 h-screen transition-transform duration-300 z-20"
            :class="{ '-translate-x-full': !showSidebar, 'translate-x-0': showSidebar }">
            <div class="pr-1 flex flex-row gap-0 items-center justify-start shrink-0 relative h-full">
                <div
                    class="bg-[#ffffff] border-solid border-[#e2e8f0] border-r pt-2.5 pb-2.5 flex flex-col gap-[15px] items-center justify-start shrink-0 relative h-full"
                    style="">

                    <!-- Logo -->
                    <div class="pr-[7px] pl-[7px] flex flex-col gap-2.5 items-start justify-start self-stretch shrink-0 relative">
                        <img class="self-stretch shrink-0 h-[34px] relative" style="object-fit: contain" src="@/assets/images/logo.png" alt="Logo" />
                    </div>

                    <!-- Navigation Container -->
                    <div
                        class="border-solid border-[#e2e8f0] border-t p-2.5 flex flex-col items-center justify-between shrink-0 flex-1 relative">

                        <!-- Main Menu Items -->
                        <div class="flex flex-col gap-[7px] items-start justify-start shrink-0 relative">
                            <router-link to="/" exact-active-class="active-menu-item"
                                class="menu-item rounded-[3px] pr-1.5 pl-1.5 flex flex-row gap-1 items-center justify-start shrink-0 w-40 h-[23px] relative">
                                <Icon icon="ph:squares-four" class="shrink-0 w-4 h-4" />
                                <div class="text-[#212121] text-left font-['Manrope-Regular',_sans-serif] text-xs font-normal relative flex items-center justify-start">
                                    Dashboard
                                </div>
                            </router-link>

                            <router-link to="/services" exact-active-class="active-menu-item"
                                class="menu-item rounded-[3px] pr-1.5 pl-1.5 flex flex-row gap-1 items-center justify-start shrink-0 w-40 h-[23px] relative">
                                <Icon icon="ph:stack" class="shrink-0 w-4 h-4" />
                                <div class="text-[#212121] text-left font-['Manrope-Regular',_sans-serif] text-xs font-normal relative flex items-center justify-start">
                                    Services
                                </div>
                            </router-link>

                            <router-link to="/domains" exact-active-class="active-menu-item"
                                class="menu-item rounded-[3px] pr-1.5 pl-1.5 flex flex-row gap-1 items-center justify-start shrink-0 w-40 h-[23px] relative">
                                <Icon icon="ph:globe" class="shrink-0 w-4 h-4" />
                                <div class="text-[#212121] text-left font-['Manrope-Regular',_sans-serif] text-xs font-normal relative flex items-center justify-start">
                                    Domains
                                </div>
                            </router-link>

                            <router-link to="/billing" exact-active-class="active-menu-item"
                                class="menu-item rounded-[3px] pr-1.5 pl-2.5 flex flex-row gap-1 items-center justify-start shrink-0 w-40 h-[23px] relative">
                                <Icon icon="ph:credit-card" class="shrink-0 w-4 h-4" />
                                <div class="text-[#212121] text-left font-['Manrope-Regular',_sans-serif] text-xs font-normal relative flex items-center justify-start">
                                    Billing
                                </div>
                            </router-link>

                            <router-link to="/projects" exact-active-class="active-menu-item"
                                class="menu-item rounded-[3px] pr-1.5 pl-1.5 flex flex-row gap-1 items-center justify-start shrink-0 w-40 h-[23px] relative">
                                <Icon icon="ph:folder" class="shrink-0 w-4 h-4" />
                                <div class="text-[#212121] text-left font-['Manrope-Regular',_sans-serif] text-xs font-normal relative flex items-center justify-start">
                                    Projects
                                </div>
                            </router-link>
                        </div>

                        <!-- Bottom Support Item -->
                        <router-link to="/support" exact-active-class="active-menu-item"
                            class="menu-item rounded-[3px] pr-1.5 pl-1.5 flex flex-row gap-1 items-center justify-start shrink-0 w-40 h-[23px] relative">
                            <Icon icon="ph:chat-circle-dots" class="shrink-0 w-4 h-4" />
                            <div class="text-[#212121] text-left font-['Manrope-Regular',_sans-serif] text-xs font-normal relative flex items-center justify-start">
                                Support
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col items-start justify-start z-1 relative transition-all duration-300"
            :class="showSidebar ? 'md:pl-[190px]' : 'md:pl-0'">
            <!-- Desktop Header -->
            <div class="hidden border-solid border-[#e2e8f0] border h-[50px] md:flex pr-2.5 pl-2.5 flex-row items-center justify-between self-stretch shrink-0 relative overflow-hidden">
                    <!-- Notification Banner (Left) -->
                    <div class="p-2.5 flex flex-row gap-2.5 items-center justify-center shrink-0 relative">
                        <Icon icon="material-symbols:menu-rounded" width="15" height="15"  style="color: 484848" class="cursor-pointer" @click="toggleSidebar" />
                        <div v-if="currentNotification" class="flex flex-row gap-2.5 items-start justify-end shrink-0 relative">
                            <div class="text-left font-['Manrope-Regular',_sans-serif] text-xs font-normal relative">
                                <span>
                                    <span class="text-[#000000]">{{ currentNotification.prefix }}</span>
                                    <span class="text-[#0c768a] font-semibold">{{ currentNotification.highlight }}</span>
                                    <span class="text-[#000000]">{{ currentNotification.suffix }}</span>
                                    <span class="text-[#0c768a] font-semibold cursor-pointer hover:underline" @click="handleNotificationAction">{{ currentNotification.action }}</span>
                                </span>
                            </div>
                        </div>
                        <div v-if="currentNotification" class="flex flex-row gap-2.5 items-center justify-start shrink-0 relative cursor-pointer" @click="dismissNotification">
                            <Icon icon="ph:x" class="shrink-0 w-[15px] h-[15px]" />
                        </div>
                    </div>

                    <!-- User Info (Right) -->
                    <div class="flex flex-row gap-0 items-center justify-center shrink-0 relative">
                        <div class="p-2.5 flex flex-row gap-2.5 items-center justify-center shrink-0 relative">
                            <div class="text-[#000000] text-left font-['Manrope-Regular',_sans-serif] text-xs font-normal relative">
                                Hello, {{ userData?.name || 'User' }}
                            </div>
                        </div>
                        <div class="p-2.5 flex flex-row gap-2.5 items-center justify-start shrink-0 relative cursor-pointer">
                            <Icon icon="ph:bell" class="shrink-0 w-5 h-5" />
                        </div>
                        <div class="pl-2.5 flex flex-row gap-2.5 items-center justify-start shrink-0 relative">
                            <div class="bg-[#d9d9d9] rounded-[50%] shrink-0 w-9 h-9 relative"></div>
                        </div>
                        <div class="p-2.5 flex flex-row gap-2.5 items-center justify-start shrink-0 relative cursor-pointer">
                            <Icon icon="ph:caret-down" class="shrink-0 w-3.5 h-3.5" />
                        </div>
                    </div>
            </div>

            <!-- Mobile Header -->
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

            <div class="main-content pr-2 pl-2 self-stretch flex-1 mt-[10px] md:mt-0">
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
        const showSidebar = ref(true)
        const isSubmenuActive = ref(false)
        const isLoading = ref(true)
        const notifications = ref([
            {
                id: 1,
                prefix: 'Hosting for ',
                highlight: 'maimo.com',
                suffix: ' is about to expire in 15 Days - ',
                action: 'Renew now',
                actionHandler: () => {
                    router.push('/billing')
                }
            },
            {
                id: 2,
                prefix: 'Your SSL certificate for ',
                highlight: 'cybercanvas.co.zm',
                suffix: ' expires in 7 Days - ',
                action: 'Renew now',
                actionHandler: () => {
                    router.push('/services')
                }
            },
            {
                id: 3,
                prefix: 'Invoice ',
                highlight: '#23455668',
                suffix: ' is overdue - ',
                action: 'Pay now',
                actionHandler: () => {
                    router.push('/billing')
                }
            }
        ])
        const currentNotificationIndex = ref(0)

        const currentNotification = ref(notifications.value[0])

        const toggleSidebar = () => {
            showSidebar.value = !showSidebar.value
        }

        const toggleSubmenu = () => {
            isSubmenuActive.value = !isSubmenuActive.value
        }

        const dismissNotification = () => {
            // Move to next notification or hide if no more
            currentNotificationIndex.value++
            if (currentNotificationIndex.value < notifications.value.length) {
                currentNotification.value = notifications.value[currentNotificationIndex.value]
            } else {
                currentNotification.value = null
            }
        }

        const handleNotificationAction = () => {
            if (currentNotification.value && currentNotification.value.actionHandler) {
                currentNotification.value.actionHandler()
            }
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
            showSidebar,
            isSubmenuActive,
            toggleSidebar,
            toggleSubmenu,
            isLoading,
            logout,
            currentNotification,
            dismissNotification,
            handleNotificationAction
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
/* Menu Item Styles */
.menu-item {
    background-color: transparent;
    transition: background-color 0.3s ease, color 0.3s ease;
}

.menu-item:hover {
    background-color: #dcebed;
}

.menu-item:hover div {
    color: #212121;
}

.menu-item:hover :deep(svg) {
    color: #212121;
}

/* Active state styling */
.active-menu-item {
    background-color: #0c768a !important;
}

.active-menu-item div {
    color: #ffffff !important;
}

.active-menu-item :deep(svg) {
    color: #ffffff !important;
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