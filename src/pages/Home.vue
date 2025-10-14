<template>
    <div>
        <side-navigation>
            <div class="flex flex-col gap-2.5 items-start justify-start self-stretch shrink-0 relative">
                <div class="pt-2.5 pb-2.5 flex flex-row gap-[21px] items-center justify-start flex-wrap content-center self-stretch shrink-0 relative">
                    <StatCard
                        label="Domains"
                        :count="1"
                        icon="ant-design:control-outlined"
                        backgroundColor="bg-[#dcebed]"
                        labelWidth="w-14"
                    />
                    <StatCard
                        label="Services"
                        :count="1"
                        icon="material-symbols:room-service-outline-rounded"
                        backgroundColor="bg-[#eef2f5]"
                    />
                    <StatCard
                        label="Unpaid Invoices"
                        :count="1"
                        icon="iconamoon:invoice"
                        backgroundColor="bg-[#f5f5f5]"
                        labelWidth="w-[94px]"
                    />
                    <StatCard
                        label="Support"
                        :count="1"
                        icon="fluent:person-support-28-regular"
                        backgroundColor="bg-[#e7eaee]"
                    />
                </div>
                <div class="flex flex-col gap-[21px] items-start justify-center self-stretch shrink-0 relative">
                    <div class="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">

                        <DataTable
                            :columns="serviceColumns"
                            :data="servicesData"
                            :showCheckboxes="false"
                            :showVerticalDividers="true"
                            :showPagination="false"
                            :clickableRows="true"
                            @row-click="handleViewService"
                        >
                            <template #renewal="{ value }">
                                <span class="text-[#0C768A] font-['Montserrat-Regular',_sans-serif] text-xs leading-4 font-normal">
                                    {{ value }}
                                </span>
                            </template>
                            <template #status="{ value }">
                                <span :class="[
                                    'font-[\'Montserrat-Regular\',_sans-serif] text-xs leading-4 font-normal',
                                    value === 'Active' ? 'text-[#00B864]' :
                                    value === 'Suspended' ? 'text-[#FF6C02]' :
                                    value === 'Expired' ? 'text-[#FF0000]' : 'text-[#1e1d26]'
                                ]">
                                    {{ value }}
                                </span>
                            </template>
                            <template #actions="{ item }">
                                <ActionDropdown
                                    :item="item"
                                    :options="serviceActionOptions"
                                    @action-clicked="handleServiceAction"
                                />
                            </template>
                        </DataTable>
                    </div>
                    <div class="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <DataTable
                            :columns="invoiceColumns"
                            :data="invoicesData"
                            :showCheckboxes="false"
                            :showVerticalDividers="true"
                            :showPagination="false"
                            :clickableRows="false"
                            :hoverable="false"
                            headerBackgroundColor="#f9f9f9"
                        >
                            <template #invoice_info="{ item }">
                                <div class="flex flex-col gap-[5px] py-[5px]">
                                    <div class="text-[#000000] text-left font-['-',_sans-serif] text-xs font-normal">
                                        <span class="font-bold">{{ item.invoice_number }}</span>
                                        <span class="text-gray-600"> (Order - {{ item.order_number }})</span>
                                    </div>
                                    <div class="text-[#000000] text-left font-['Manrope-Regular',_sans-serif] text-xs font-normal">
                                        Services: {{ item.services }}
                                    </div>
                                </div>
                            </template>
                            <template #payment_info="{ item }">
                                <div class="flex flex-col gap-[5px] items-end py-[5px]">
                                    <div class="text-[#000000] text-right font-['Manrope-Bold',_sans-serif] text-xs font-bold">
                                        {{ item.currency }} {{ item.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                                    </div>
                                    <div class="text-[#000000] text-right font-['Manrope-Regular',_sans-serif] text-xs font-normal">
                                        {{ item.status === 'PAID' ? 'Paid' : 'Pending' }} {{ item.payment_date }}
                                    </div>
                                    <div :class="[
                                        'text-right font-[\'Manrope-Bold\',_sans-serif] text-xs font-bold',
                                        item.status === 'PAID' ? 'text-[#00b864]' : 'text-[#ff9800]'
                                    ]">
                                        {{ item.status }}
                                    </div>
                                </div>
                            </template>
                        </DataTable>
                    </div>
                    <div class="flex flex-col gap-0 items-start justify-start self-stretch shrink-0 relative">
                        <DataTable
                            :columns="supportColumns"
                            :data="supportData"
                            :showCheckboxes="false"
                            :showVerticalDividers="false"
                            :showPagination="false"
                            :clickableRows="false"
                            :hoverable="false"
                            headerBackgroundColor="#f9f9f9"
                        >
                            <template #ticket_info="{ item }">
                                <div class="flex flex-col gap-[5px] py-[5px]">
                                    <div class="text-[#000000] text-left font-['Manrope-Bold',_sans-serif] text-xs font-bold">
                                        {{ item.ticket_number }}
                                    </div>
                                    <div class="text-[#818181] text-left font-['Manrope-Regular',_sans-serif] text-[11px] font-normal">
                                        {{ item.category }} -
                                    </div>
                                </div>
                            </template>
                            <template #subject="{ item }">
                                <div class="text-[#000000] text-left font-['Manrope-Regular',_sans-serif] text-xs font-normal py-[5px]">
                                    {{ item.subject }}
                                </div>
                            </template>
                            <template #updated="{ item }">
                                <div class="text-[#818181] text-left font-['Manrope-Regular',_sans-serif] text-xs font-normal py-[5px]">
                                    {{ item.updated }}
                                </div>
                            </template>
                        </DataTable>
                    </div>
                </div>
            </div>

            <PortalPopup v-if="isImageDownloadPopupOpen" overlayColor="rgba(0, 0, 0, 0.2)" placement="Centered"
                :onOutsideClick="closeImageDownloadPopup">
                <DownloadQRVue @close="closeImageDownloadPopup" />
                <!-- <SingleFileUpload :onClose="closeImageUploadPopup" @file-uploaded="closeImageUploadPopup" /> -->
            </PortalPopup>
        </side-navigation>


    </div>
</template>

<script>
import SideNavigation from '@/components/SideNavigation.vue'
import ButtonVue from '@/components/Button.vue';
import PortalPopup from '@/components/PortalPopup.vue';
import StatCard from '@/components/StatCard.vue';
import DataTable from '@/components/common/DataTable.vue';
import ActionDropdown from '@/components/common/ActionDropdown.vue';
import { Icon } from "@iconify/vue";
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import DownloadQRVue from '@/components/DownloadQR.vue';
export default {
    name: 'Home',
    components: {
        SideNavigation,
        ButtonVue,
        StatCard,
        DataTable,
        ActionDropdown,
        Icon,
        PortalPopup,
        DownloadQRVue,
        onMounted,
        watch,
        useRoute
    },

    methods: {
        openImageDownloadPopup() {
            this.isImageDownloadPopupOpen = true;
        },
        closeImageDownloadPopup() {
            this.isImageDownloadPopupOpen = false;
        }
    },
    data() {
        return {
            isImageDownloadPopupOpen: false,
            sections: [
                { title: 'Domains', expanded: false },
                { title: 'Website', expanded: false },
                { title: 'Web Hosting', expanded: false },
                { title: 'QR Codes', expanded: true },
            ],

            qrCodes: [
                {
                    title: 'Maimo QR code',
                    protection: 'Enabled',
                    expiryText: 'Expires in 367 Days'
                },
                {
                    title: 'Cyber Canvas Website QR code',
                    protection: 'Enabled',
                    expiryText: 'Expires in 367 Days'
                }
            ],

            serviceColumns: [
                { key: 'invoice_number', label: 'Service' },
                { key: 'customer_name', label: '', width: 'auto', align: 'right', slot: 'renewal' },
                { key: 'status', label: '', width: 'auto', align: 'right', slot: 'status' },
                { key: 'actions', label: '', width: 'auto', slot: 'actions', align: 'right' }
            ],
            serviceActionOptions: [
                { label: 'View', value: 'view' },
                { label: 'Edit', value: 'edit' },
                { label: 'Delete', value: 'delete' }
            ],
            servicesData: [
                {
                    id: 1,
                    invoice_number: 'Value Hosting - cybercanvas.co.zm',
                    customer_name: 'Renews in 367 Days',
                    status: 'Active',
                    created_at: '2024-01-15',
                    due_date: '2025-01-15',
                    total_amount: 1200,
                    currency: 'ZMW',
                    payment_method: 'Bank Transfer'
                },
                {
                    id: 2,
                    invoice_number: 'Value Hosting - cybercanvas.co.zm',
                    customer_name: 'Renews in 120 Days',
                    status: 'Suspended',
                    created_at: '2024-06-15',
                    due_date: '2024-12-15',
                    total_amount: 1200,
                    currency: 'ZMW',
                    payment_method: 'Cash'
                },
                {
                    id: 3,
                    invoice_number: 'Value Hosting - cybercanvas.co.zm',
                    customer_name: 'Renews in 45 Days',
                    status: 'Expired',
                    created_at: '2024-09-15',
                    due_date: '2024-11-01',
                    total_amount: 1200,
                    currency: 'ZMW',
                    payment_method: 'Mobile Money',
                    is_overdue: true
                }
            ],
            invoiceColumns: [
                { key: 'invoice_info', label: 'Invoices', slot: 'invoice_info' },
                { key: 'payment_info', label: '', slot: 'payment_info', align: 'right' }
            ],
            invoicesData: [
                {
                    id: 1,
                    invoice_number: 'CC-0010245',
                    order_number: '#23455666',
                    services: 'Domain, Hosting & Maintenance',
                    amount: 5990.05,
                    currency: 'ZMW',
                    payment_date: '25th Nov 24',
                    status: 'PAID'
                },
                {
                    id: 2,
                    invoice_number: 'CC-0010246',
                    order_number: '#23455667',
                    services: 'SSL Certificate & SEO',
                    amount: 1200.00,
                    currency: 'ZMW',
                    payment_date: '26th Nov 24',
                    status: 'PAID'
                },
                {
                    id: 3,
                    invoice_number: 'CC-0010247',
                    order_number: '#23455668',
                    services: 'Website Redesign',
                    amount: 8500.00,
                    currency: 'ZMW',
                    payment_date: '27th Nov 24',
                    status: 'PENDING'
                }
            ],
            supportColumns: [
                { key: 'ticket_info', label: 'Support', slot: 'ticket_info' },
                { key: 'subject', label: '', slot: 'subject' },
                { key: 'updated', label: '', slot: 'updated' }
            ],
            supportData: [
                {
                    id: 1,
                    ticket_number: 'SV-0010245',
                    category: 'General',
                    subject: 'Email Setup for andy@aczmbia.com',
                    updated: 'Updated 7 days ago'
                },
                {
                    id: 2,
                    ticket_number: 'SV-0010246',
                    category: 'Technical',
                    subject: 'Database Migration for user@aczmbia.com',
                    updated: 'Completed 3 days ago'
                }
            ]
        };
    },
    mounted() {
        const route = this.$route;
        if (route.query.isPopupOpen === 'true') {
            this.isImageDownloadPopupOpen = true;
        }
    },
    watch: {
        '$route.query.isPopupOpen': function (newValue) {
            if (newValue === 'true') {
                this.isImageDownloadPopupOpen = true;
            }
        }
    },
    methods: {
        goToDetails() {
            this.$router.push({ name: 'qr-detail' });
        },
        goToSelectQR() {
            this.$router.push({ name: 'qr-select' });
        },
        toggleSection(index) {
            this.sections[index].expanded = !this.sections[index].expanded;
        },
        handleViewService(item) {
            console.log('View service:', item);
            // Navigate to service details page
        },
        handleEditService(item) {
            console.log('Edit service:', item);
            // Navigate to edit page or open modal
        },
        handleDeleteService(item) {
            console.log('Delete service:', item);
            // Show confirmation dialog
        },
        handleServiceAction({ action, item }) {
            switch (action) {
                case 'view':
                    this.handleViewService(item);
                    break;
                case 'edit':
                    this.handleEditService(item);
                    break;
                case 'delete':
                    this.handleDeleteService(item);
                    break;
            }
        }
    },
};
</script>

<style s SideNavigationcoped></style>