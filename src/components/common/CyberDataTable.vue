<template>
    <div class="flex flex-col gap-5 items-start justify-start relative w-full">
        <!-- Table Header Controls -->
        <div v-if="!paginationOnly" class="bg-[#ffffff] dark:bg-gray-800 flex flex-col gap-0.5 items-start justify-start self-stretch shrink-0 relative transition-colors duration-200">
            <div class="flex flex-col gap-0.5 items-start justify-start self-stretch shrink-0 relative">
                <div class="flex flex-col gap-[7px] items-start justify-start self-stretch shrink-0 relative">
                    <div class="flex flex-row gap-[3px] items-center justify-between self-stretch shrink-0 relative">
                        <div class="flex flex-row gap-5 items-center justify-start shrink-0 relative">

                            <div class="flex flex-row gap-2 items-start justify-start shrink-0 relative">
                                <!-- Pagination Dropdown -->
                                <div class="relative pt-[2px]">
                                    <div
                                        class="bg-shades-white dark:bg-gray-700 rounded-[3px] py-[4px] px-3 flex flex-row gap-2 items-center justify-center shrink-0 relative cursor-pointer border-[1px] border-solid border-[#e2e8f0] dark:border-gray-600"
                                        @click="togglePaginationDropdown">
                                        <span
                                            class="text-gray-300 dark:text-gray-300 text-left font-['Inter-Medium',_sans-serif] text-[12px] leading-5 font-medium"
                                            style="letter-spacing: 0.02em">{{ selectedLimit }}</span>
                                        <Icon icon="ph:caret-down" class="w-4 h-4 text-[#464F60] dark:text-gray-400" />
                                    </div>

                                    <!-- Pagination Dropdown -->
                                    <div v-if="showPaginationDropdown"
                                        class="absolute top-full left-0 z-50 mt-1 bg-[#ffffff] dark:bg-gray-700 rounded-[3px] p-1 flex flex-col gap-0 items-center justify-center overflow-hidden shadow-lg border border-[#e2e8f0] dark:border-gray-600">
                                        <div v-for="option in paginationOptions" :key="option"
                                            class="rounded pt-1 pr-2.5 pb-1 pl-2.5 flex flex-row gap-2 items-center justify-start w-10 relative cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
                                            :class="{ 'bg-[#2c5d73] dark:bg-[#26666f]': selectedLimit === option }"
                                            @click="selectPagination(option)">
                                            <div class="text-center font-['Inter-Medium',_sans-serif] text-xs leading-5 font-medium relative flex-1"
                                                style="letter-spacing: 0.02em"
                                                :class="selectedLimit === option ? 'text-white' : 'text-[#464f60] dark:text-gray-300'">
                                                {{ option }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Bulk Actions (if checkboxes are enabled and items are selected) -->
                                <div v-if="showCheckboxes && hasSelectedItems" 
                                    class="flex flex-row gap-2 items-center justify-center shrink-0 relative">
                                    
                                    <!-- Invoice-specific actions -->
                                    <template v-if="tableType === 'invoices'">
                                        <!-- Mark as Paid Button -->
                                        <button
                                            class="bg-[#ffffff] rounded-[3px] border-solid border-[#e2e8f0] border pt-[7px] pr-0.5 pb-[7px] pl-0.5 flex flex-row gap-7 items-start justify-start shrink-0 relative overflow-hidden cursor-pointer hover:bg-green-50"
                                            @click="executeBulkAction('mark-paid')"
                                            :disabled="isProcessingBulkAction">
                                            <div class="pr-1.5 pl-1.5 flex flex-row gap-2.5 items-center justify-start shrink-0 relative">
                                                <Icon v-if="isProcessingBulkAction" icon="eos-icons:loading"
                                                    class="animate-spin h-3 w-3 mr-1" />
                                                <div class="text-[#000000] text-left font-['Roboto-Regular',_sans-serif] text-xs font-normal relative">
                                                    {{ isProcessingBulkAction ? 'Processing...' : 'Mark As Paid' }}
                                                </div>
                                            </div>
                                        </button>
                                        
                                        <!-- Mark as Unpaid Button -->
                                        <button
                                            class="bg-[#ffffff] rounded-[3px] border-solid border-[#e2e8f0] border pt-[7px] pr-0.5 pb-[7px] pl-0.5 flex flex-row gap-7 items-start justify-start shrink-0 relative overflow-hidden cursor-pointer hover:bg-red-50"
                                            @click="executeBulkAction('mark-unpaid')"
                                            :disabled="isProcessingBulkAction">
                                            <div class="pr-1.5 pl-1.5 flex flex-row gap-2.5 items-center justify-start shrink-0 relative">
                                                <Icon v-if="isProcessingBulkAction" icon="eos-icons:loading"
                                                    class="animate-spin h-3 w-3 mr-1" />
                                                <div class="text-[#000000] text-left font-['Roboto-Regular',_sans-serif] text-xs font-normal relative">
                                                    {{ isProcessingBulkAction ? 'Processing...' : 'Mark As Unpaid' }}
                                                </div>
                                            </div>
                                        </button>
                                        
                                        <!-- Send Reminder Button -->
                                        <button
                                            class="bg-[#ffffff] rounded-[3px] border-solid border-[#e2e8f0] border pt-[7px] pr-0.5 pb-[7px] pl-0.5 flex flex-row gap-7 items-start justify-start shrink-0 relative overflow-hidden cursor-pointer hover:bg-blue-50"
                                            @click="executeBulkAction('send-reminder')"
                                            :disabled="isProcessingBulkAction">
                                            <div class="pr-1.5 pl-1.5 flex flex-row gap-2.5 items-center justify-start shrink-0 relative">
                                                <Icon v-if="isProcessingBulkAction" icon="eos-icons:loading"
                                                    class="animate-spin h-3 w-3 mr-1" />
                                                <div class="text-[#000000] text-left font-['Roboto-Regular',_sans-serif] text-xs font-normal relative">
                                                    {{ isProcessingBulkAction ? 'Processing...' : 'Send Reminder' }}
                                                </div>
                                            </div>
                                        </button>

                                        <!-- Payment Method Dropdown -->
                                        <select v-model="selectedPaymentMethod"
                                            class="cursor-pointer py-[6px] px-2 bg-shades-white rounded-[3px] overflow-hidden shrink-0 flex items-center justify-between border-[1px] border-solid border-[#e2e8f0]"
                                            :disabled="isProcessingBulkAction"
                                            :class="{ 'opacity-50 cursor-not-allowed': isProcessingBulkAction }">
                                            <option v-for="method in paymentMethods" :key="method" :value="method">{{ method }}</option>
                                        </select>
                                    </template>

                                    <!-- Todo-specific actions -->
                                    <template v-else-if="tableType === 'todos'">
                                        <!-- Mark as Complete Button -->
                                        <button
                                            class="bg-[#ffffff] rounded-[3px] border-solid border-[#e2e8f0] border pt-[7px] pr-0.5 pb-[7px] pl-0.5 flex flex-row gap-7 items-start justify-start shrink-0 relative overflow-hidden cursor-pointer hover:bg-green-50"
                                            @click="executeBulkAction('mark-complete')"
                                            :disabled="isProcessingBulkAction">
                                            <div class="pr-1.5 pl-1.5 flex flex-row gap-2.5 items-center justify-start shrink-0 relative">
                                                <Icon v-if="isProcessingBulkAction" icon="eos-icons:loading"
                                                    class="animate-spin h-3 w-3 mr-1" />
                                                <div class="text-[#000000] text-left font-['Roboto-Regular',_sans-serif] text-xs font-normal relative">
                                                    {{ isProcessingBulkAction ? 'Processing...' : 'Mark as Complete' }}
                                                </div>
                                            </div>
                                        </button>
                                    </template>

                                    <!-- Quotation-specific actions -->
                                    <template v-else-if="tableType === 'quotations'">
                                        <!-- Mark as Accepted Button -->
                                        <button
                                            class="bg-[#ffffff] rounded-[3px] border-solid border-[#e2e8f0] border pt-[7px] pr-0.5 pb-[7px] pl-0.5 flex flex-row gap-7 items-start justify-start shrink-0 relative overflow-hidden cursor-pointer hover:bg-green-50"
                                            @click="executeBulkAction('mark-accepted')"
                                            :disabled="isProcessingBulkAction">
                                            <div class="pr-1.5 pl-1.5 flex flex-row gap-2.5 items-center justify-start shrink-0 relative">
                                                <Icon v-if="isProcessingBulkAction" icon="eos-icons:loading"
                                                    class="animate-spin h-3 w-3 mr-1" />
                                                <div class="text-[#000000] text-left font-['Roboto-Regular',_sans-serif] text-xs font-normal relative">
                                                    {{ isProcessingBulkAction ? 'Processing...' : 'Mark As Accepted' }}
                                                </div>
                                            </div>
                                        </button>

                                        <!-- Send Reminder Button -->
                                        <button
                                            class="bg-[#ffffff] rounded-[3px] border-solid border-[#e2e8f0] border pt-[7px] pr-0.5 pb-[7px] pl-0.5 flex flex-row gap-7 items-start justify-start shrink-0 relative overflow-hidden cursor-pointer hover:bg-blue-50"
                                            @click="executeBulkAction('send-reminder')"
                                            :disabled="isProcessingBulkAction">
                                            <div class="pr-1.5 pl-1.5 flex flex-row gap-2.5 items-center justify-start shrink-0 relative">
                                                <Icon v-if="isProcessingBulkAction" icon="eos-icons:loading"
                                                    class="animate-spin h-3 w-3 mr-1" />
                                                <div class="text-[#000000] text-left font-['Roboto-Regular',_sans-serif] text-xs font-normal relative">
                                                    {{ isProcessingBulkAction ? 'Processing...' : 'Send Reminder' }}
                                                </div>
                                            </div>
                                        </button>
                                    </template>

                                </div>

                            </div>


                        </div>

                        <!-- Search Input and Create Button -->
                        <div class="flex flex-row gap-2 items-center justify-start shrink-0 relative">
                            <div class="bg-shades-white rounded-[3px] py-[5px] pr-3 pl-3 flex flex-row gap-2 items-center justify-start shrink-0 relative overflow-hidden border-[1px] border-solid border-[#e2e8f0]">
                                <Icon icon="ph:magnifying-glass" class="w-4 h-4 text-[#868FA0]" />
                                <input v-model="searchQuery"
                                    class="text-gray-300 text-left font-['Inter-Regular',_sans-serif] text-[12px] leading-5 font-normal w-52 bg-transparent border-none outline-none"
                                    style="letter-spacing: 0.02em" placeholder="Search..." />
                                <div class="rounded shrink-0 w-4 h-4 bg-[#E9EDF5] flex items-center justify-center">
                                    <span class="text-gray-300 text-xs font-medium">/</span>
                                </div>
                            </div>
                            
                            <!-- Create Button -->
                            <button v-if="showCreateButton"
                                @click="emit('create-item')"
                                class="bg-[#26666f] hover:bg-[#1f5159] rounded-[3px] py-[5px] px-3 flex flex-row gap-2 items-center justify-center shrink-0 relative cursor-pointer transition-colors">
                                <Icon :icon="createButtonIcon" class="w-4 h-4 text-white" />
                                <span class="text-white text-left font-['Inter-Medium',_sans-serif] text-[12px] leading-5 font-medium whitespace-nowrap"
                                    style="letter-spacing: 0.02em">{{ createButtonText }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Category Tabs -->
                    <div class="flex flex-row gap-5 items-center justify-start self-stretch shrink-0 relative">
                        <div class="flex flex-col items-center justify-center shrink-0 relative cursor-pointer"
                            @click="selectActiveTab('All')">
                            <div class="flex flex-row gap-1.5 items-center justify-center shrink-0 relative">
                                <div
                                    class="flex flex-col gap-1 items-center justify-center shrink-0 w-[19px] relative">
                                    <div class="text-left font-['Inter-Bold',_sans-serif] text-[12px] leading-5 font-bold relative self-stretch"
                                        style="letter-spacing: 0.02em"
                                        :class="activeTab === 'All' ? 'text-[#26666f]' : 'text-[#464f60]'">
                                        All
                                    </div>
                                </div>
                                <div class="rounded-[13px] pr-1.5 pl-1.5 flex flex-row gap-2.5 items-center justify-center shrink-0 relative"
                                    :class="activeTab === 'All' ? 'bg-indigo-0' : 'bg-gray-50'">
                                    <div class="text-left font-['Inter-Medium',_sans-serif] text-[10px] leading-4 font-medium relative flex items-center justify-start"
                                        style="letter-spacing: 0.03em"
                                        :class="activeTab === 'All' ? 'text-[#26666f]' : 'text-gray-600'">
                                        {{ filteredData.length }}
                                    </div>
                                </div>
                            </div>
                            <div class="self-stretch shrink-0 h-0.5 relative overflow-visible"
                                :class="activeTab === 'All' ? 'bg-[#26666F]' : 'bg-transparent'" style="width: 50px">
                            </div>
                        </div>

                        <!-- Additional category tabs based on table type -->
                        <template v-for="(category, index) in categoryTabs" :key="index">
                            <div class="flex flex-col items-center justify-center shrink-0 relative cursor-pointer"
                                @click="selectActiveTab(category.name)">
                                <div class="flex flex-row gap-1.5 items-center justify-center shrink-0 relative">
                                    <div class="flex flex-row gap-2.5 items-center justify-center shrink-0 relative">
                                        <div class="text-left font-['Inter-Medium',_sans-serif] text-xs leading-5 font-medium relative"
                                            style="letter-spacing: 0.02em"
                                            :class="activeTab === category.name ? 'text-[#26666f]' : 'text-[#464f60]'">
                                            {{ category.name }}
                                        </div>
                                    </div>
                                    <div class="rounded-[13px] pr-1.5 pl-1.5 flex flex-row gap-2.5 items-center justify-center shrink-0 relative"
                                        :class="activeTab === category.name ? 'bg-indigo-0' : 'bg-gray-50'">
                                        <div class="text-left font-['Inter-Medium',_sans-serif] text-[10px] leading-4 font-medium relative flex items-center justify-start"
                                            style="letter-spacing: 0.03em"
                                            :class="activeTab === category.name ? 'text-[#26666f]' : 'text-gray-600'">
                                            {{ category.count }}
                                        </div>
                                    </div>
                                </div>
                                <div class="self-stretch shrink-0 h-0.5 relative overflow-visible"
                                    :class="activeTab === category.name ? 'bg-[#26666F]' : 'bg-transparent'"
                                    :style="{ width: category.name.length * 8 + 16 + 'px' }">
                                </div>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- Unified Data Table -->
                <div v-if="!paginationOnly" class="w-full py-1 overflow-x-auto">
                    <table class="w-full bg-white border-collapse border border-[#E9EDF5] min-w-full">
                        <!-- Table Header -->
                        <thead>
                            <tr class="bg-[#DCEBED]" style="backdrop-filter: blur(4px)">
                                <!-- Checkbox column header (if enabled) -->
                                <th v-if="showCheckboxes" class="pt-1.5 pr-2.5 pb-1.5 pl-2.5 text-left border-b border-[#E9EDF5] w-12" :class="{ 'border-r border-[#E9EDF5]': showVerticalLines }">
                                    <label class="flex flex-row items-center justify-start gap-[13px] font-manrope cursor-pointer">
                                        <input class="opacity-0 absolute h-0 w-0" type="checkbox" v-model="isAllChecked"
                                            @change="toggleAllItems" />
                                        <span
                                            class="rounded-xs overflow-hidden border-[1px] border-solid border-[#e2e8f0] w-3.5 h-3.5 flex items-center justify-center">
                                            <svg v-if="isAllChecked" xmlns="http://www.w3.org/2000/svg"
                                                class="h-4 w-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
                                        </span>
                                    </label>
                                </th>
                                
                                <th v-for="(column, index) in tableColumns" :key="index"
                                    class="pt-1.5 pr-2.5 pb-1.5 pl-2.5 text-left border-b border-[#E9EDF5] whitespace-nowrap"
                                    :class="{ 'border-r border-[#E9EDF5]': showVerticalLines && index < tableColumns.length - 1 }">
                                    <div class="flex flex-row gap-0.5 items-center justify-start"
                                        :class="{ 'cursor-pointer': column.sortable }"
                                        @click="column.sortable ? sortColumn(column.key) : null">
                                        <div class="text-black text-left font-['Inter-Medium',_sans-serif] text-xs leading-[18px] font-medium uppercase"
                                            style="letter-spacing: 0.03em">
                                            {{ column.header }}
                                        </div>
                                        <Icon v-if="column.sortable" icon="ph:caret-up-down"
                                            class="w-3 h-3 text-[#A1A9B8]"
                                            :class="{ 'text-[#26666f]': sortField === column.key }" />
                                    </div>
                                </th>
                            </tr>
                        </thead>

                        <!-- Table Body -->
                        <tbody>
                            <!-- Display message when no data is found -->
                            <tr v-if="noDataFound">
                                <td :colspan="tableColumns.length" class="p-4 text-center">
                                    <p class="text-[#687182] text-sm">{{ noDataMessage }}</p>
                                </td>
                            </tr>
                            
                            <template v-else v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
                                <tr class="hover:bg-gray-50 transition-colors cursor-pointer" 
                                    :class="{ 'bg-red-50 border-l-4 border-red-400': row.is_overdue }"
                                    @click="handleRowClick(row, $event)">
                                    <!-- Checkbox column (if enabled) -->
                                    <td v-if="showCheckboxes" class="pr-2.5 pl-2.5 w-12" :class="{ 'border-r border-[#E9EDF5]': showVerticalLines }">
                                        <label class="flex flex-row items-center justify-start gap-[13px] font-manrope cursor-pointer"
                                            @click.stop>
                                            <input class="opacity-0 absolute h-0 w-0" type="checkbox" :checked="row.isChecked"
                                                @click.stop @change="toggleItemCheck(row, $event)" />
                                            <span
                                                class="rounded-xs overflow-hidden border-[1px] border-solid border-[#e2e8f0] w-3.5 h-3.5 flex items-center justify-center">
                                                <svg v-if="row.isChecked" xmlns="http://www.w3.org/2000/svg"
                                                    class="h-4 w-4 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                        d="M5 13l4 4L19 7" />
                                                </svg>
                                            </span>
                                        </label>
                                    </td>
                                    
                                    <td v-for="(column, colIndex) in tableColumns" :key="colIndex"
                                        class="pr-2.5 pl-2.5 text-left py-0" :class="{
                                            'w-auto min-w-0': colIndex === 0,
                                            'w-20': column.type === 'actions',
                                            'whitespace-nowrap': column.type !== 'text',
                                            'border-r border-[#E9EDF5]': showVerticalLines && colIndex < tableColumns.length - 1
                                        }">

                                        <!-- Dynamic cell content based on column type -->
                                        <div v-if="column.type === 'text'" class="flex flex-col gap-0">
                                            <div
                                                class="text-[#2e2e2e] text-left font-['Roboto-Regular',_sans-serif] text-xs leading-4 font-normal">
                                                <!-- Special handling for customer_name to show company first -->
                                                <template v-if="column.key === 'customer_name' && row.edges && row.edges.user">
                                                    {{ row.edges.user.company || `${row.edges.user.first_name || ''} ${row.edges.user.last_name || ''}`.trim() || '-' }}
                                                </template>
                                                <template v-else>
                                                    {{ row[column.key] || '-' }}
                                                </template>
                                            </div>
                                            <div v-if="row[column.key + '_subtitle'] || (column.key === 'customer_name' && row.edges && row.edges.user && row.edges.user.company)"
                                                class="text-[#26666F] text-left font-['Roboto-Regular',_sans-serif] text-[10px] leading-2 font-normal">
                                                <!-- Special handling for customer_name to show contact person as subtitle -->
                                                <template v-if="column.key === 'customer_name' && row.edges && row.edges.user && row.edges.user.company">
                                                    {{ `${row.edges.user.first_name || ''} ${row.edges.user.last_name || ''}`.trim() || '-' }}
                                                </template>
                                                <template v-else>
                                                    {{ row[column.key + '_subtitle'] || '' }}
                                                </template>
                                            </div>
                                        </div>

                                        <div v-else-if="column.type === 'link'" class="flex flex-row gap-2">
                                            <router-link :to="`${column.linkPath}${row.id}`"
                                                class="flex items-center gap-2 no-underline text-cyan-950 cursor-pointer">
                                                <div
                                                    class="text-[#2e2e2e] text-left font-['Roboto-Medium',_sans-serif] text-xs leading-5 font-medium">
                                                    {{ row[column.key] || '-' }}
                                                </div>
                                            </router-link>
                                        </div>

                                        <div v-else-if="column.type === 'expense-name'" class="flex flex-col gap-0">
                                            <router-link :to="`${column.linkPath}${row.id}`"
                                                class="flex items-center gap-2 no-underline text-cyan-950 cursor-pointer">
                                                <div class="text-[#2e2e2e] text-left font-['Roboto-Medium',_sans-serif] text-xs leading-5 font-medium"
                                                    :class="{ 'text-red-600': row.is_overdue }">
                                                    {{ row.name || '-' }}
                                                </div>
                                            </router-link>
                                            <div v-if="row.is_overdue && row.overdue_label"
                                                class="text-red-500 text-left font-['Roboto-Regular',_sans-serif] text-[10px] leading-3 font-medium">
                                                {{ row.overdue_label }}
                                            </div>
                                        </div>

                                        <div v-else-if="column.type === 'currency'" class="flex flex-col gap-0">
                                            <div
                                                class="text-zinc-700 text-left font-['Roboto-Bold',_sans-serif] text-xs leading-5 font-bold">
                                                {{ formatAmount && row.currency ? formatAmount(row[column.key], row.currency) : (row[column.key] || '-') }}
                                            </div>
                                            <div v-if="row[column.key + '_subtitle']"
                                                class="text-[#5d5d5d] text-left font-['Roboto-Regular',_sans-serif] text-[10px] leading-4 font-normal">
                                                {{ row[column.key + '_subtitle'] || '' }}
                                            </div>
                                        </div>

                                        <div v-else-if="column.type === 'badge'"
                                            class="flex flex-row gap-1 items-center flex-wrap">
                                            <template v-if="Array.isArray(row[column.key]) && row[column.key].length > 0">
                                                <div v-for="(tag, tagIndex) in row[column.key]" :key="tagIndex"
                                                    class="rounded-[3px] border-solid border-[#eaeaea] border pt-0.5 pr-2 pb-0.5 pl-2 flex flex-row gap-0 items-center justify-center"
                                                    :class="getBadgeStyle(tag)">
                                                    <div class="text-left font-['Roboto-Medium',_sans-serif] text-xs leading-4 font-medium"
                                                        :class="getBadgeTextStyle(tag)">
                                                        {{ tag }}
                                                    </div>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <div class="rounded-[3px] border-solid border-[#eaeaea] border pt-0.5 pr-2 pb-0.5 pl-2 flex flex-row gap-0 items-center justify-center"
                                                    :class="getBadgeStyle(row[column.key])">
                                                    <div class="text-left font-['Roboto-Medium',_sans-serif] text-xs leading-4 font-medium"
                                                        :class="getBadgeTextStyle(row[column.key])">
                                                        {{ row[column.key] || '-' }}
                                                    </div>
                                                </div>
                                            </template>
                                        </div>

                                        <div v-else-if="column.type === 'status'"
                                            class="flex flex-row gap-0.5 items-center">
                                            <div class="rounded pt-px pr-2 pb-px pl-2 flex flex-row gap-1.5 items-center justify-center"
                                                :class="getStatusStyle(row[column.key])">
                                                <div class="rounded-sm shrink-0 w-1.5 h-1.5"
                                                    :class="getStatusDotStyle(row[column.key])"></div>
                                                <div class="text-left font-['Inter-Medium',_sans-serif] text-xs leading-4 font-medium"
                                                    :class="getStatusTextStyle(row[column.key])"
                                                    style="letter-spacing: 0.03em">
                                                    {{ row[column.key] || '-' }}
                                                </div>
                                            </div>
                                        </div>

                                        <div v-else-if="column.type === 'payment-toggle'"
                                            class="flex flex-row gap-2 items-center">
                                            <label class="flex items-center cursor-pointer" @click.stop>
                                                <input type="checkbox" 
                                                    :checked="row.isPaid || row.status === 'Paid'"
                                                    @change="togglePaymentStatus(row, $event)"
                                                    class="sr-only" />
                                                <div class="relative">
                                                    <div class="w-8 h-4 bg-gray-300 rounded-full shadow-inner transition-colors duration-200"
                                                        :class="{ 'bg-green-400': row.isPaid || row.status === 'Paid' }"></div>
                                                    <div class="absolute inset-y-0 left-0 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200"
                                                        :class="{ 'translate-x-4': row.isPaid || row.status === 'Paid' }"></div>
                                                </div>
                                            </label>
                                            <span class="text-xs font-medium"
                                                :class="{ 'text-green-600': row.isPaid || row.status === 'Paid', 'text-gray-500': !(row.isPaid || row.status === 'Paid') }">
                                                {{ (row.isPaid || row.status === 'Paid') ? 'Paid' : 'Unpaid' }}
                                            </span>
                                        </div>

                                        <AvatarGroup v-else-if="column.type === 'users'"
                                                     :users="row[column.key] || []"
                                                     :max-display="3" />

                                        <div v-else-if="column.type === 'owner'" style="width: 105px;">
                                            <div class="flex items-center space-x-2" v-if="getNestedValue(row, column.key)">
                                                <AvatarGroup 
                                                    :users="[formatOwnerForAvatar(getNestedValue(row, column.key))]"
                                                    :max-display="1" />
                                                <span class="text-xs text-gray-700">
                                                    {{ getOwnerName(getNestedValue(row, column.key)) }}
                                                </span>
                                            </div>
                                            <div v-else class="text-xs text-gray-400">-</div>
                                        </div>

                                        <div v-else-if="column.type === 'timeline' && row[column.key]"
                                            class="flex flex-row gap-[7px] items-center justify-start">
                                            <div
                                                class="bg-[#e9edf5] rounded pt-px pr-2 pb-px pl-2 flex flex-row gap-1.5 items-center justify-center">
                                                <div class="text-[#464f60] text-left font-['Inter-Medium',_sans-serif] text-xs leading-[18px] font-medium"
                                                    style="letter-spacing: 0.03em">
                                                    {{ row[column.key]?.start || '-' }}
                                                </div>
                                            </div>
                                            <Icon icon="ph:caret-right" class="w-4 h-4 text-[#868FA0]" />
                                            <div
                                                class="bg-[#e9edf5] rounded pt-px pr-2 pb-px pl-2 flex flex-row gap-1.5 items-center justify-center">
                                                <div class="text-[#464f60] text-left font-['Inter-Medium',_sans-serif] text-xs leading-[18px] font-medium"
                                                    style="letter-spacing: 0.03em">
                                                    {{ row[column.key]?.end || '-' }}
                                                </div>
                                            </div>
                                        </div>

                                        <div v-else-if="column.type === 'date'"
                                            class="text-[#2e2e2e] text-left font-['Roboto-Regular',_sans-serif] text-xs leading-5 font-normal">
                                            {{ formatDate ? formatDate(row[column.key]) : (row[column.key] || '-') }}
                                        </div>

                                        <div v-else-if="column.type === 'actions'"
                                            class="flex flex-row gap-1 items-center relative">
                                            <div class="flex flex-row gap-2.5 items-center justify-start">
                                                <div class="rounded p-1 flex flex-row gap-2 items-center justify-center overflow-hidden cursor-pointer"
                                                    data-action-button
                                                    @click.stop="toggleActionDropdown(rowIndex, $event)">
                                                    <Icon icon="ph:dots-three" class="w-7 h-7 text-[#687182]" />
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Default fallback -->
                                        <div v-else
                                            class="text-[#2e2e2e] text-left font-['Roboto-Regular',_sans-serif] text-xs leading-5 font-normal">
                                            {{ row[column.key] || '-' }}
                                        </div>
                                    </td>
                                </tr>
                                <!-- Divider between rows -->
                                <tr v-if="rowIndex < paginatedData.length - 1" :key="'divider-' + rowIndex">
                                    <td :colspan="tableColumns.length + (showCheckboxes ? 1 : 0)" class="p-0">
                                        <hr class="table-divider" />
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Action Dropdown (positioned outside table to avoid overflow issues) -->
        <div v-if="!paginationOnly && showActionDropdown !== null"
            class="fixed z-[9999] bg-[#ffffff] rounded-[3px] pt-2 pr-1.5 pb-2 pl-1.5 flex flex-col gap-px items-start justify-start w-[120px] overflow-hidden shadow-lg border border-[#e2e8f0]"
            :style="{ 
                top: dropdownPosition.top + 'px',
                left: dropdownPosition.left + 'px'
            }"
            data-action-dropdown
            @click.stop>
            <div class="rounded pt-1 pr-2.5 pb-1 pl-2.5 flex flex-row gap-2 items-center justify-start self-stretch shrink-0 relative cursor-pointer hover:bg-gray-50"
                @click="viewItem(paginatedData[showActionDropdown])">
                <div class="flex flex-row gap-2.5 items-center justify-center flex-1 relative">
                    <div class="text-[#2c5d73] text-left font-['Inter-Medium',_sans-serif] text-xs leading-5 font-medium relative flex-1"
                        style="letter-spacing: 0.02em">
                        View
                    </div>
                </div>
                <Icon icon="ph:info-circle" class="w-4 h-4 text-[#26666F]" />
            </div>
            <div v-if="tableType === 'invoices' || tableType === 'quotations'" class="rounded pt-1 pr-2.5 pb-1 pl-2.5 flex flex-row gap-2 items-center justify-start self-stretch shrink-0 relative cursor-pointer hover:bg-gray-50"
                @click="handleDownload(paginatedData[showActionDropdown])">
                <div class="flex flex-row gap-2.5 items-center justify-center flex-1 relative">
                    <div class="text-[#26666f] text-left font-['Inter-Medium',_sans-serif] text-xs leading-5 font-medium relative flex-1"
                        style="letter-spacing: 0.02em">
                        Download
                    </div>
                </div>
                <Icon icon="ph:download-simple" class="w-4 h-4 text-[#26666F]" />
            </div>
            <div class="rounded pt-1 pr-2.5 pb-1 pl-2.5 flex flex-row gap-2 items-center justify-start self-stretch shrink-0 relative cursor-pointer hover:bg-gray-50"
                @click="editItem(paginatedData[showActionDropdown])">
                <div class="flex flex-row gap-2.5 items-center justify-center flex-1 relative">
                    <div class="text-[#26666f] text-left font-['Inter-Medium',_sans-serif] text-xs leading-5 font-medium relative flex-1"
                        style="letter-spacing: 0.02em">
                        Edit
                    </div>
                </div>
                <Icon icon="ph:pencil" class="w-4 h-4 text-[#26666F]" />
            </div>
            <div class="rounded pt-1 pr-2.5 pb-1 pl-2.5 flex flex-row gap-2 items-center justify-start self-stretch shrink-0 relative cursor-pointer hover:bg-gray-50"
                @click="deleteItem(paginatedData[showActionDropdown])">
                <div class="text-[#d12953] text-left font-['Inter-Medium',_sans-serif] text-xs leading-5 font-medium relative flex-1"
                    style="letter-spacing: 0.02em">
                    Delete
                </div>
                <Icon icon="ph:trash" class="w-4 h-4 text-[#DC4067]" />
            </div>
        </div>

        <!-- Pagination -->
        <div class="self-stretch overflow-hidden flex flex-row items-center justify-between py-0 pt-2.5 px-[5px]">
            <div class="flex flex-row items-center justify-center">
                <div class="relative font-roboto text-black text-left text-xs leading-5 mr-2.5">
                    <template v-if="selectedLimit === 'All'">
                        Showing all {{ totalRecords }} entries
                    </template>
                    <template v-else>
                        Showing {{ ((currentPage - 1) * Number(selectedLimit)) + 1 }} to
                        {{ Math.min(currentPage * Number(selectedLimit), totalRecords) }}
                        of {{ totalRecords }} entries
                    </template>
                </div>
            </div>
            <div class="flex flex-row items-center justify-center">
                <button
                    class="cursor-pointer py-[7px] px-0.5 bg-shades-white rounded-l-10xs border-[1px] border-solid border-[#e2e8f0] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="currentPage === 1" @click="previousPage">
                    <div class="flex flex-row items-start justify-start py-0 px-1.5">
                        <div class="relative text-xs font-roboto text-black text-left">Previous</div>
                    </div>
                </button>
                <div class="flex flex-row items-center">
                    <template v-for="page in visiblePages" :key="page">
                        <button v-if="page !== '...'"
                            class="cursor-pointer py-[7px] px-0 bg-shades-white square border-x-[1px] border-solid border-[#e2e8f0] hover:bg-gray-100"
                            :class="{ 'bg-gray-200': page === currentPage }" @click="goToPage(page)">
                            <div class="flex flex-row items-start justify-start py-0 px-1.5">
                                <div class="relative text-xs font-roboto text-black text-left">{{ page }}</div>
                            </div>
                        </button>
                        <span v-else class="px-2 py-[7px] text-xs text-gray-500">...</span>
                    </template>
                </div>
                <button
                    class="cursor-pointer py-[7px] px-0 bg-shades-white rounded-r-10xs border-[1px] border-solid border-[#e2e8f0] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="currentPage === totalPages" @click="nextPage">
                    <div class="flex flex-row items-start justify-start py-0 px-1.5">
                        <div class="relative text-xs font-roboto text-black text-left">Next</div>
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { getColorForLetter } from '@/utils/avatarUtils'
import FilterDropdown from './FilterDropdown.vue'
import AvatarGroup from './AvatarGroup.vue'

export default {
    name: 'CyberDataTable',
    components: {
        Icon,
        FilterDropdown,
        AvatarGroup
    },
    props: {
        tableType: {
            type: String,
            default: 'invoices',
            validator: (value) => ['expenses', 'projects', 'todos', 'invoices', 'quotations', 'proposals'].includes(value)
        },
        tableData: {
            type: Array,
            default: () => []
        },
        totalEntries: {
            type: Number,
            default: 0
        },
        showExportButton: {
            type: Boolean,
            default: false
        },
        showBulkActionButton: {
            type: Boolean,
            default: false
        },
        showCreateButton: {
            type: Boolean,
            default: false
        },
        createButtonText: {
            type: String,
            default: 'Create Item'
        },
        createButtonIcon: {
            type: String,
            default: 'ph:plus-light'
        },
        formatAmount: {
            type: Function,
            default: null
        },
        formatDate: {
            type: Function,
            default: null
        },
        showCheckboxes: {
            type: Boolean,
            default: false
        },
        bulkActions: {
            type: Array,
            default: () => []
        },
        paymentMethods: {
            type: Array,
            default: () => ['Cash', 'Mobile Money', 'Bank Transfer']
        },
        selectedPaymentMethod: {
            type: String,
            default: 'Cash'
        },
        isProcessingBulkAction: {
            type: Boolean,
            default: false
        },
        paginationOnly: {
            type: Boolean,
            default: false
        },
        hiddenColumns: {
            type: Array,
            default: () => []
        },
        showVerticalLines: {
            type: Boolean,
            default: false
        }
    },
    emits: [
        'search',
        'page-change',
        'limit-change',
        'sort-change',
        'filter-change',
        'tab-change',
        'create-item',
        'export-data',
        'bulk-action',
        'view-item',
        'edit-item',
        'delete-item',
        'download',
        'item-check',
        'select-all',
        'bulk-action-execute',
        'row-click',
        'toggle-payment-status',
        'period-filter-change',
        'open-add-todo'
    ],
    setup(props, { emit }) {
        // Reactive data
        const currentPage = ref(1)
        const selectedLimit = ref(20)
        const totalEntries = ref(25)
        const searchQuery = ref('')
        const selectedFilter = ref('All')
        const activeTab = ref('All')
        const sortField = ref('')
        const sortDirection = ref('asc')
        const showFilterDropdown = ref(false)
        const showPaginationDropdown = ref(false)
        const showActionDropdown = ref(null)
        const hoveredUser = ref(null)
        const dropdownPosition = ref({ top: 0, left: 0 })
        
        // Checkbox and bulk action related data
        const isAllChecked = ref(false)
        const selectedPaymentMethod = ref('Cash')
        const showBulkActions = ref(false)

        // Period filter data (for todos)
        const periodFilterOptions = ref(['Daily', 'Weekly', 'Monthly'])
        const periodFilterSelected = ref('Daily')

        // Pagination options
        const paginationOptions = [5, 10, 15, 20, 30, 40, 50]

        // Sample data for different table types
        const sampleData = {
            expenses: [],
            projects: [],
            todos: [],
            invoices: []
        }

        // Table configurations
        const tableConfigs = {
            expenses: {
                actionButtonLabel: 'Create Expense',
                categoryTabs: [
                    { name: 'Monthly', count: 0 },
                    { name: 'Quarterly', count: 0 },
                    { name: 'Semi-annually', count: 0 },
                    { name: 'Annually', count: 0 }
                ],
                columns: [
                    { key: 'id', header: 'ID', type: 'text', sortable: true },
                    { key: 'display_name', header: 'Name', type: 'expense-name', linkPath: '/acc-sp/admin/expense/', sortable: true },
                    { key: 'type', header: 'Type', type: 'badge', sortable: true },
                    { key: 'amount', header: 'Amount', type: 'currency', sortable: true },
                    { key: 'currency', header: 'Currency', type: 'text', sortable: true },
                    { key: 'frequency', header: 'Frequency', type: 'badge', sortable: true },
                    { key: 'payment_status', header: 'Payment Status', type: 'payment-toggle', sortable: false },
                    { key: 'due_date', header: 'Due Date', type: 'date', sortable: true },
                    { key: 'actions', header: 'Action', type: 'actions', sortable: false }
                ]
            },
            projects: {
                actionButtonLabel: 'Add Project',
                categoryTabs: [
                    { name: 'Hosting', count: 1 },
                    { name: 'Analytics', count: 1 }
                ],
                columns: [
                    { key: 'project', header: 'Project', type: 'text', sortable: true },
                    { key: 'type', header: 'Type', type: 'badge', sortable: true },
                    { key: 'assigned', header: 'Assigned', type: 'users', sortable: true },
                    { key: 'status', header: 'Status', type: 'status', sortable: true },
                    { key: 'dueDate', header: 'Due Date', type: 'date', sortable: true },
                    { key: 'timeline', header: 'Project Timeline', type: 'timeline', sortable: true },
                    { key: 'estimate', header: 'Estimate', type: 'currency', sortable: true },
                    { key: 'actions', header: 'Action', type: 'actions', sortable: false }
                ]
            },
            todos: {
                actionButtonLabel: 'Add Todo',
                categoryTabs: [
                    { name: 'Today', count: 2 },
                    { name: 'Overdue', count: 1 },
                    { name: 'Upcoming', count: 2 }
                ],
                columns: [
                    { key: 'title', header: 'Description', type: 'text', sortable: true },
                    { key: 'tags', header: 'Tags', type: 'badge', sortable: true },
                    { key: 'assignees', header: 'Assigned', type: 'users', sortable: true },
                    { key: 'status', header: 'Status', type: 'status', sortable: true },
                    { key: 'dueDate', header: 'Due Date', type: 'text', sortable: true },
                    { key: 'createdDate', header: 'Created', type: 'text', sortable: true },
                    { key: 'actions', header: 'Action', type: 'actions', sortable: false }
                ]
            },
            invoices: {
                actionButtonLabel: 'Create Invoice',
                categoryTabs: [
                    { name: 'Paid', count: 0 },
                    { name: 'Unpaid', count: 0 },
                    { name: 'Partial', count: 0 },
                    { name: 'Overdue', count: 0 }
                ],
                columns: [
                    { key: 'invoice_number', header: 'Invoice #', type: 'text', sortable: true },
                    { key: 'customer_name', header: 'Customer', type: 'text', sortable: true },
                    { key: 'created_at', header: 'Created', type: 'date', sortable: true },
                    { key: 'due_date', header: 'Due Date', type: 'date', sortable: true },
                    { key: 'total_amount', header: 'Amount', type: 'currency', sortable: true },
                    { key: 'payment_method', header: 'Payment Method', type: 'select', sortable: true },
                    { key: 'status', header: 'Status', type: 'status', sortable: true },
                    { key: 'actions', header: 'Action', type: 'actions', sortable: false }
                ]
            },
            quotations: {
                actionButtonLabel: 'Create Quotation',
                categoryTabs: [
                    { name: 'Draft', count: 0 },
                    { name: 'Sent', count: 0 },
                    { name: 'Accepted', count: 0 },
                    { name: 'Expired', count: 0 }
                ],
                columns: [
                    { key: 'quote_number', header: 'Quotation #', type: 'text', sortable: true },
                    { key: 'customer_name', header: 'Customer', type: 'text', sortable: true },
                    { key: 'created_date', header: 'Created', type: 'date', sortable: true },
                    { key: 'expiry_date', header: 'Valid Until', type: 'date', sortable: true },
                    { key: 'total_amount', header: 'Amount', type: 'currency', sortable: true },
                    { key: 'status', header: 'Status', type: 'badge', sortable: true },
                    { key: 'actions', header: 'Action', type: 'actions', sortable: false }
                ]
            },
            proposals: {
                actionButtonLabel: 'New Proposal',
                categoryTabs: [
                    { name: 'Draft', count: 0 },
                    { name: 'Sent', count: 0 },
                    { name: 'Accepted', count: 0 },
                    { name: 'Rejected', count: 0 }
                ],
                columns: [
                    { key: 'name', header: 'Proposal Name', type: 'text', sortable: true },
                    { key: 'client', header: 'Client', type: 'text', sortable: true },
                    { key: 'created_at', header: 'Date Created', type: 'date', sortable: true },
                    { key: 'created_by', header: 'Created By', type: 'owner', sortable: true },
                    { key: 'status', header: 'Status', type: 'status', sortable: true },
                    { key: 'actions', header: 'Action', type: 'actions', sortable: false }
                ]
            }
        }

        // Filter options based on table type
        const filterOptionsMap = {
            expenses: ['All', 'Monthly', 'Quarterly', 'Semi-annually', 'Annually'],
            projects: ['All', 'Hosting', 'Analytics', 'Backend', 'Frontend', 'Full Stack', 'Documentation', 'Infrastructure'],
            todos: ['All', 'Today', 'Overdue', 'Upcoming', 'Backend', 'Frontend', 'Documentation', 'Security'],
            invoices: ['All', 'Paid', 'Unpaid', 'Partial', 'Overdue', 'Draft', 'Hosting', 'Analytics', 'Development', 'Consulting', 'Maintenance', 'Custom'],
            quotations: ['All', 'Draft', 'Sent', 'Accepted', 'Expired', 'Hosting', 'Analytics', 'Development', 'Consulting', 'Maintenance', 'Custom'],
            proposals: ['All', 'Draft', 'Sent', 'Accepted', 'Rejected']
        }

        // Computed properties
        const currentConfig = computed(() => tableConfigs[props.tableType])
        const actionButtonLabel = computed(() => currentConfig.value.actionButtonLabel)
        const categoryTabs = computed(() => {
            const configTabs = currentConfig.value.categoryTabs || []
            const data = propsTableData.value || []

            // Calculate dynamic counts for each tab
            return configTabs.map(tab => {
                let count = 0

                if (props.tableType === 'todos') {
                    // For todos, filter by status-based categories
                    const statusMap = {
                        'Today': ['In Progress', 'On track'],
                        'Overdue': ['Overdue'],
                        'Upcoming': ['Pending', 'Planning']
                    }
                    if (statusMap[tab.name]) {
                        count = data.filter(item => statusMap[tab.name].includes(item.status)).length
                    } else {
                        // For work item types and tags
                        count = data.filter(item => {
                            const workItemType = item.work_item_type || '';
                            const tags = Array.isArray(item.tags) ? item.tags : [];
                            return workItemType === tab.name || tags.includes(tab.name);
                        }).length;
                    }
                } else if (props.tableType === 'invoices') {
                    // For invoices, filter by status
                    count = data.filter(item => item.status === tab.name).length
                } else if (props.tableType === 'expenses') {
                    // For expenses, filter by frequency
                    count = data.filter(item => item.frequency === tab.name).length
                } else {
                    // For other types, filter by type
                    count = data.filter(item => item.type === tab.name).length
                }

                return {
                    ...tab,
                    count
                }
            })
        })
        const tableColumns = computed(() => {
            const allColumns = currentConfig.value.columns
            // Filter out hidden columns
            if (props.hiddenColumns && props.hiddenColumns.length > 0) {
                return allColumns.filter(col => !props.hiddenColumns.includes(col.key))
            }
            return allColumns
        })
        const propsTableData = computed(() => {
            // Always use the provided tableData, even if empty
            return props.tableData || []
        })
        const filterOptions = computed(() => filterOptionsMap[props.tableType])

        // Filtered data based on search and active filters
        const filteredData = computed(() => {
            let data = propsTableData.value || []

            // Ensure data is an array
            if (!Array.isArray(data)) {
                return []
            }

            // Apply search filter
            if (searchQuery.value) {
                const query = searchQuery.value.toLowerCase()
                data = data.filter(item => {
                    if (!item) return false
                    return Object.values(item).some(value => {
                        if (typeof value === 'string') {
                            return value.toLowerCase().includes(query)
                        }
                        if (typeof value === 'object' && value !== null) {
                            return Object.values(value).some(v =>
                                typeof v === 'string' && v.toLowerCase().includes(query)
                            )
                        }
                        return false
                    })
                })
            }

            // Apply category filter
            if (activeTab.value !== 'All') {
                if (props.tableType === 'todos') {
                    // For todos, filter by status-based categories
                    const statusMap = {
                        'Today': ['In Progress', 'On track'],
                        'Overdue': ['Overdue'],
                        'Upcoming': ['Pending', 'Planning']
                    }
                    if (statusMap[activeTab.value]) {
                        data = data.filter(item => statusMap[activeTab.value].includes(item.status))
                    } else {
                        // For work item types and tags
                        data = data.filter(item => {
                            const workItemType = item.work_item_type || '';
                            const tags = Array.isArray(item.tags) ? item.tags : [];
                            return workItemType === activeTab.value || tags.includes(activeTab.value);
                        });
                    }
                } else if (props.tableType === 'invoices') {
                    // For invoices, filter by status
                    data = data.filter(item => item.status === activeTab.value)
                } else if (props.tableType === 'quotations') {
                    // For quotations, filter by status
                    data = data.filter(item => item.status === activeTab.value)
                } else if (props.tableType === 'expenses') {
                    // For expenses, filter by frequency
                    if (activeTab.value !== 'All') {
                        data = data.filter(item => item.frequency === activeTab.value)
                    }
                } else {
                    // For other types, filter by type
                    data = data.filter(item => item.type === activeTab.value)
                }
            }

            // Apply dropdown filter
            if (selectedFilter.value !== 'All') {
                if (props.tableType === 'todos') {
                    // For todos, apply special logic for date-based filters
                    const statusMap = {
                        'Today': ['In Progress', 'On track'],
                        'Overdue': ['Overdue'],
                        'Upcoming': ['Pending', 'Planning']
                    }
                    if (statusMap[selectedFilter.value]) {
                        data = data.filter(item => statusMap[selectedFilter.value].includes(item.status))
                    } else {
                        data = data.filter(item => {
                            const workItemType = item.work_item_type || '';
                            const tags = Array.isArray(item.tags) ? item.tags : [];
                            return workItemType === selectedFilter.value || tags.includes(selectedFilter.value);
                        });
                    }
                } else if (props.tableType === 'invoices') {
                    // For invoices, filter by status or type
                    data = data.filter(item =>
                        item.status === selectedFilter.value ||
                        item.type === selectedFilter.value
                    )
                } else if (props.tableType === 'quotations') {
                    // For quotations, filter by status or type
                    data = data.filter(item =>
                        item.status === selectedFilter.value || item.type === selectedFilter.value
                    )
                } else if (props.tableType === 'expenses') {
                    // For expenses, apply frequency-based dropdown filter
                    if (selectedFilter.value !== 'All') {
                        data = data.filter(item => item.frequency === selectedFilter.value)
                    }
                } else {
                    // For other types, filter by type
                    data = data.filter(item => item.type === selectedFilter.value)
                }
            }

            return data
        })

        // Sorted data
        const sortedData = computed(() => {
            const data = filteredData.value || []
            
            if (!Array.isArray(data)) {
                return []
            }
            
            if (!sortField.value) return data

            return [...data].sort((a, b) => {
                if (!a || !b) return 0
                
                let aVal = a[sortField.value]
                let bVal = b[sortField.value]

                // Handle different data types
                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase()
                    bVal = bVal ? bVal.toLowerCase() : ''
                }

                if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
                if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
                return 0
            })
        })

        // Paginated data
        const paginatedData = computed(() => {
            const data = sortedData.value || []
            
            if (!Array.isArray(data)) {
                return []
            }
            
            // If totalEntries is provided, we're in server-side pagination mode
            // In this mode, the parent component handles pagination, so we show all data
            if (props.totalEntries && props.totalEntries > 0) {
                return data
            }
            
            // Client-side pagination: If selectedLimit is 'All', return all data
            if (selectedLimit.value === 'All') {
                return data
            }
            
            const limit = Number(selectedLimit.value) || 10
            const start = (currentPage.value - 1) * limit
            const end = start + limit
            return data.slice(start, end)
        })

        const totalRecords = computed(() => {
            if (props.totalEntries && props.totalEntries > 0) {
                return props.totalEntries
            }
            const data = filteredData.value || []
            return Array.isArray(data) ? data.length : 0
        })
        const totalPages = computed(() => {
            const records = totalRecords.value || 0
            
            // If selectedLimit is 'All', there's only 1 page
            if (selectedLimit.value === 'All') {
                return 1
            }
            
            const limit = Number(selectedLimit.value) || 10
            return Math.max(1, Math.ceil(records / limit))
        })

        // Computed property for visible page numbers (limit to 5 pages around current page)
        const visiblePages = computed(() => {
            const total = totalPages.value
            const current = currentPage.value
            const pages = []
            
            if (total <= 7) {
                // If 7 or fewer pages, show all
                for (let i = 1; i <= total; i++) {
                    pages.push(i)
                }
            } else {
                // Show first page
                pages.push(1)
                
                if (current > 4) {
                    pages.push('...')
                }
                
                // Show pages around current page
                const start = Math.max(2, current - 2)
                const end = Math.min(total - 1, current + 2)
                
                for (let i = start; i <= end; i++) {
                    pages.push(i)
                }
                
                if (current < total - 3) {
                    pages.push('...')
                }
                
                // Show last page
                if (total > 1) {
                    pages.push(total)
                }
            }
            
            return pages
        })
        
        // Check if there's no data to display
        const noDataFound = computed(() => {
            const data = paginatedData.value || []
            return !Array.isArray(data) || data.length === 0
        })
        
        // Check if there are selected items for bulk actions
        const hasSelectedItems = computed(() => {
            const data = paginatedData.value || []
            return data.some(item => item.isChecked)
        })
        
        // Contextual no data messages based on table type
        const noDataMessage = computed(() => {
            const messages = {
                expenses: 'No expenses found matching your search criteria.',
                projects: 'No projects found matching your search criteria.',
                todos: 'No todos found matching your search criteria.',
                invoices: 'No invoices found matching your search criteria.',
                quotations: 'No quotations found matching your search criteria.'
            }
            return messages[props.tableType] || 'No data found matching your search criteria.'
        })

        // Methods
        const toggleFilterDropdown = () => {
            showFilterDropdown.value = !showFilterDropdown.value
            showPaginationDropdown.value = false
            showActionDropdown.value = null
        }

        const togglePaginationDropdown = () => {
            showPaginationDropdown.value = !showPaginationDropdown.value
            showFilterDropdown.value = false
            showActionDropdown.value = null
        }

        const toggleActionDropdown = (index, event) => {
            if (event && typeof event.stopPropagation === 'function') {
                event.stopPropagation()
            }
            if (showActionDropdown.value === index) {
                showActionDropdown.value = null
            } else {
                showActionDropdown.value = index
                // Calculate dropdown position - position directly below the icon
                if (event && event.target) {
                    const iconElement = event.target.closest('.cursor-pointer')
                    if (iconElement) {
                        const iconRect = iconElement.getBoundingClientRect()
                        dropdownPosition.value = {
                            top: iconRect.bottom + window.scrollY + 4,
                            left: iconRect.right - 120 + window.scrollX // 120px is dropdown width, align right edge
                        }
                    }
                }
            }
            showFilterDropdown.value = false
            showPaginationDropdown.value = false
        }

        const selectFilter = (filter) => {
            selectedFilter.value = filter
            showFilterDropdown.value = false
            currentPage.value = 1 // Reset to first page
            emit('filter-change', { filter, page: 1 })
        }

        const selectPagination = (option) => {
            selectedLimit.value = option
            showPaginationDropdown.value = false
            currentPage.value = 1 // Reset to first page
            
            // Only emit if we're in server-side pagination mode
            if (props.totalEntries && props.totalEntries > 0) {
                emit('limit-change', { limit: option, page: 1 })
            }
        }

        const selectActiveTab = (tab) => {
            activeTab.value = tab
            currentPage.value = 1 // Reset to first page
            emit('tab-change', { tab, page: 1 })
        }

        const selectPeriodFilter = (option) => {
            periodFilterSelected.value = option
            currentPage.value = 1 // Reset to first page
            emit('period-filter-change', { period: option, page: 1 })
        }

        const sortColumn = (field) => {
            if (sortField.value === field) {
                sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
            } else {
                sortField.value = field
                sortDirection.value = 'asc'
            }
            currentPage.value = 1 // Reset to first page
            emit('sort-change', { field, direction: sortDirection.value, page: 1 })
        }

        // Action methods
        const viewItem = (item) => {
            emit('view-item', item)
            showActionDropdown.value = null
        }

        const editItem = (item) => {
            emit('edit-item', item)
            showActionDropdown.value = null
        }

        const deleteItem = (item) => {
            emit('delete-item', item)
            showActionDropdown.value = null
        }

        const handleCreateItem = () => {
            if (props.tableType === 'todos') {
                emit('open-add-todo')
            } else {
                emit('create-item')
            }
        }

        const handleDownload = (item) => {
            emit('download', item)
        }

        // Checkbox and bulk action methods
        const toggleAllItems = () => {
            // Check current state - if all items are checked, we'll uncheck them all
            const allChecked = paginatedData.value.every(item => item.isChecked)
            const newState = !allChecked

            // Update the checkbox state for all items in the current page
            paginatedData.value.forEach(item => {
                item.isChecked = newState
            })

            isAllChecked.value = newState
            emit('select-all', {
                isAllChecked: newState,
                items: paginatedData.value.map(item => ({ ...item }))
            })
        }

        const toggleItemCheck = (item, event) => {
            if (event && typeof event.stopPropagation === 'function') {
                event.stopPropagation()
            }
            item.isChecked = !item.isChecked
            emit('item-check', item, item.isChecked)
        }

        const executeBulkAction = (actionType) => {
            emit('bulk-action-execute', actionType)
        }

        const handleRowClick = (item, event) => {
            if (!item) return

            if (event && event.target) {
                const interactiveSelector = 'button, a, input, label, svg, [data-no-row-click]'
                if (event.target.closest(interactiveSelector)) {
                    return
                }
            }

            emit('row-click', item)
        }

        const togglePaymentStatus = (item, event) => {
            if (event && typeof event.stopPropagation === 'function') {
                event.stopPropagation()
            }
            const newStatus = event.target.checked ? 'Paid' : 'Unpaid'
            emit('toggle-payment-status', { item, status: newStatus, isPaid: event.target.checked })
        }

        // Style methods
        const getBadgeStyle = (value) => {
            const styles = {
                'Utilities': 'bg-blue-50 border-blue-200',
                'Hosting': 'bg-green-50 border-green-200',
                'Office': 'bg-yellow-50 border-yellow-200',
                'Software': 'bg-purple-50 border-purple-200',
                'Marketing': 'bg-pink-50 border-pink-200',
                'Backend': 'bg-[#eef2ff] border-[#c7d2fe]',
                'Frontend': 'bg-green-50 border-green-200',
                'Full Stack': 'bg-blue-50 border-blue-200',
                'Documentation': 'bg-gray-50 border-gray-200',
                'Development': 'bg-indigo-50 border-indigo-200',
                'Consulting': 'bg-yellow-50 border-yellow-200',
                'Maintenance': 'bg-orange-50 border-orange-200',
                'Custom': 'bg-purple-50 border-purple-200',
                'Security': 'bg-red-50 border-red-200',
                'Infrastructure': 'bg-cyan-50 border-cyan-200',
                'Analytics': 'bg-emerald-50 border-emerald-200',
                'personal': 'bg-blue-50 border-blue-200',
                'subtask': 'bg-purple-50 border-purple-200',
                // Frequency colors - all use #77B1BC
                'Monthly': 'bg-[#e6f2f5] border-[#77B1BC]',
                'Quarterly': 'bg-[#e6f2f5] border-[#77B1BC]',
                'Semi-annually': 'bg-[#e6f2f5] border-[#77B1BC]',
                'Annually': 'bg-[#e6f2f5] border-[#77B1BC]',
                // Type colors - use #26666F
                'Recurring': 'bg-[#e8eef0] border-[#26666F]',
                'One-time': 'bg-[#e8eef0] border-[#26666F]',
                'Unpaid': 'bg-[#ffcccc]',
                'Paid': 'bg-green-100',
                'Pending': 'bg-yellow-100',
                'Active': 'bg-blue-100',
                'Overdue': 'bg-red-100',
                'Draft': 'bg-gray-100',
                'Partial': 'bg-orange-100'
            }
            return styles[value] || 'bg-gray-50 border-gray-200'
        }

        const getBadgeTextStyle = (value) => {
            const styles = {
                'Utilities': 'text-blue-700',
                'Hosting': 'text-green-700',
                'Office': 'text-yellow-700',
                'Software': 'text-purple-700',
                'Marketing': 'text-pink-700',
                'Backend': 'text-[#4f46e5]',
                'Frontend': 'text-green-700',
                'Full Stack': 'text-blue-700',
                'Documentation': 'text-gray-300',
                'Development': 'text-indigo-700',
                'Consulting': 'text-yellow-700',
                'Maintenance': 'text-orange-700',
                'Custom': 'text-purple-700',
                'Security': 'text-red-700',
                'Infrastructure': 'text-cyan-700',
                'Analytics': 'text-emerald-700',
                'personal': 'text-blue-700',
                'subtask': 'text-purple-700',
                // Frequency colors - all use darker #77B1BC for better visibility
                'Monthly': 'text-[#4a8a9a]',
                'Quarterly': 'text-[#4a8a9a]',
                'Semi-annually': 'text-[#4a8a9a]',
                'Annually': 'text-[#4a8a9a]',
                // Type colors - use #26666F
                'Recurring': 'text-[#26666F]',
                'One-time': 'text-[#26666F]',
                'Unpaid': 'text-[#ff1008]',
                'Paid': 'text-green-800',
                'Pending': 'text-yellow-800',
                'Active': 'text-blue-800',
                'Overdue': 'text-red-800',
                'Draft': 'text-gray-800',
                'Partial': 'text-orange-800'
            }
            return styles[value] || 'text-[#000000]'
        }

        const getStatusStyle = (value) => {
            const styles = {
                'On track': 'bg-green-50',
                'In Progress': 'bg-blue-50',
                'Delayed': 'bg-red-50',
                'Planning': 'bg-yellow-50',
                'Completed': 'bg-gray-50',
                'completed': 'bg-gray-50',
                'Overdue': 'bg-red-50',
                'Pending': 'bg-yellow-50',
                'pending': 'bg-yellow-50',
                'Paid': 'bg-green-50',
                'Unpaid': 'bg-red-50',
                'Partial': 'bg-orange-50',
                'Draft': 'bg-gray-50'
            }
            return styles[value] || 'bg-gray-50'
        }

        const getStatusDotStyle = (value) => {
            const styles = {
                'On track': 'bg-green-400',
                'In Progress': 'bg-blue-400',
                'Delayed': 'bg-red-400',
                'Planning': 'bg-yellow-400',
                'Completed': 'bg-gray-400',
                'completed': 'bg-gray-400',
                'Overdue': 'bg-red-400',
                'Pending': 'bg-yellow-400',
                'pending': 'bg-yellow-400',
                'Paid': 'bg-green-400',
                'Unpaid': 'bg-red-400',
                'Partial': 'bg-orange-400',
                'Draft': 'bg-gray-400'
            }
            return styles[value] || 'bg-gray-400'
        }

        const getStatusTextStyle = (value) => {
            const styles = {
                'On track': 'text-green-700',
                'In Progress': 'text-blue-700',
                'Delayed': 'text-red-700',
                'Planning': 'text-yellow-700',
                'Completed': 'text-gray-300',
                'completed': 'text-gray-300',
                'Overdue': 'text-red-700',
                'Pending': 'text-yellow-700',
                'pending': 'text-yellow-700',
                'Paid': 'text-green-700',
                'Unpaid': 'text-red-700',
                'Partial': 'text-orange-700',
                'Draft': 'text-gray-700'
            }
            return styles[value] || 'text-gray-300'
        }

        // Helper functions for owner column
        const getNestedValue = (obj, path) => {
            return path.split('.').reduce((current, key) => current?.[key], obj)
        }

        const getOwnerInitials = (owner) => {
            if (!owner) return '?'
            const firstName = owner.first_name || ''
            const lastName = owner.last_name || ''
            return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
        }

        const getOwnerName = (owner) => {
            if (!owner) return 'Unknown'
            return `${owner.first_name || ''} ${owner.last_name || ''}`.trim() || owner.email || 'Unknown'
        }

        const formatOwnerForAvatar = (owner) => {
            if (!owner) return { name: 'Unknown' }
            return {
                name: `${owner.first_name || ''} ${owner.last_name || ''}`.trim() || owner.email || 'Unknown',
                avatar: owner.avatar || null
            }
        }

        // Pagination methods
        const previousPage = () => {
            if (currentPage.value > 1) {
                currentPage.value--
                // Only emit if we're in server-side pagination mode
                if (props.totalEntries && props.totalEntries > 0) {
                    emit('page-change', { page: currentPage.value, limit: selectedLimit.value })
                }
            }
        }

        const nextPage = () => {
            if (currentPage.value < totalPages.value) {
                currentPage.value++
                // Only emit if we're in server-side pagination mode
                if (props.totalEntries && props.totalEntries > 0) {
                    emit('page-change', { page: currentPage.value, limit: selectedLimit.value })
                }
            }
        }

        const goToPage = (page) => {
            currentPage.value = page
            
            // If we're in server-side pagination mode (totalEntries provided), emit page change
            if (props.totalEntries && props.totalEntries > 0) {
                emit('page-change', { page: currentPage.value, limit: selectedLimit.value })
            }
        }

        // Mouse hover methods for user avatars
        const mouseOverAssignee = (rowId, userId) => {
            // You can implement hover logic here if needed
            hoveredUser.value = `${rowId}-${userId}`
        }

        const mouseLeaveAssignee = () => {
            hoveredUser.value = null
        }

        // Utility method for avatar colors
        const getColorForLetterLocal = (letter) => {
            return getColorForLetter(letter)
        }

        // Watch for changes to reset pagination and close dropdowns
        watch([searchQuery, selectedFilter, activeTab], () => {
            // Only reset pagination for server-side mode or when it makes sense
            if (props.totalEntries && props.totalEntries > 0) {
                currentPage.value = 1
                emit('search', {
                    query: searchQuery.value,
                    filter: selectedFilter.value,
                    tab: activeTab.value,
                    page: 1
                })
            }
        })

        // Watch for changes in paginated data to update select all checkbox state
        watch(paginatedData, (newData) => {
            if (newData && newData.length > 0) {
                isAllChecked.value = newData.every(item => item.isChecked)
            } else {
                isAllChecked.value = false
            }
        }, { immediate: true, deep: true })

        // Sync payment method with parent component
        watch(() => props.selectedPaymentMethod, (newValue) => {
            if (newValue) {
                selectedPaymentMethod.value = newValue
            }
        }, { immediate: true })

        watch(selectedPaymentMethod, (newValue) => {
            emit('payment-method-change', newValue)
        })

        // Close dropdowns when clicking outside
        onMounted(() => {
            const handleClickOutside = (e) => {
                // Close action dropdown if clicking outside
                if (showActionDropdown.value !== null) {
                    const actionDropdown = e.target.closest('[data-action-dropdown]')
                    const actionButton = e.target.closest('[data-action-button]')
                    
                    // If not clicking the button or inside the dropdown, close it
                    if (!actionButton && !actionDropdown) {
                        showActionDropdown.value = null
                    }
                }
                
                // Close other dropdowns
                if (!e.target.closest('.relative')) {
                    showFilterDropdown.value = false
                    showPaginationDropdown.value = false
                }
            }
            
            document.addEventListener('click', handleClickOutside)
            
            // Set default sorting for expenses table
            if (props.tableType === 'expenses') {
                sortField.value = 'due_date'
                sortDirection.value = 'desc' // Most recent due dates first
            }
        })

        return {
            // Reactive data
            currentPage,
            selectedLimit,
            totalEntries: totalRecords,
            searchQuery,
            selectedFilter,
            activeTab,
            sortField,
            sortDirection,
            showFilterDropdown,
            showPaginationDropdown,
            showActionDropdown,
            paginationOptions,
            dropdownPosition,

            // Computed properties
            actionButtonLabel,
            categoryTabs,
            tableColumns,
            tableData: propsTableData,
            filteredData,
            paginatedData,
            totalRecords,
            totalPages,
            visiblePages,
            filterOptions,
            noDataFound,
            noDataMessage,
            hasSelectedItems,

            // Checkbox and bulk action related
            isAllChecked,
            selectedPaymentMethod,
            showBulkActions,

            // Period filter properties
            periodFilterOptions,
            periodFilterSelected,

            // Methods
            toggleFilterDropdown,
            togglePaginationDropdown,
            toggleActionDropdown,
            selectFilter,
            selectPagination,
            selectActiveTab,
            selectPeriodFilter,
            sortColumn,
            viewItem,
            editItem,
            deleteItem,
            handleCreateItem,
            handleDownload,
            toggleAllItems,
            toggleItemCheck,
            executeBulkAction,
            handleRowClick,
            getBadgeStyle,
            getBadgeTextStyle,
            getStatusStyle,
            getStatusDotStyle,
            getStatusTextStyle,
            getNestedValue,
            getOwnerInitials,
            getOwnerName,
            formatOwnerForAvatar,
            previousPage,
            nextPage,
            goToPage,
            mouseOverAssignee,
            mouseLeaveAssignee,
            getColorForLetter: getColorForLetterLocal,
            hoveredUser,
            togglePaymentStatus,
            emit
        }
    }
}
</script>

<style scoped>
.square {
    aspect-ratio: 1;
}

/* Flush 1px table divider used between rows */
.table-divider {
    height: 1px;
    margin: 0;
    border: none;
    background-color: #E9EDF5;
    /* matches previous border color */
    display: block;
}
</style>