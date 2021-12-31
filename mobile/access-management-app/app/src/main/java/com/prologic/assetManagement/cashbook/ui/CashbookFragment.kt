/*
 * <Asset Management Water System for managing water system assets like
 * finance, maintenance and supply by Community Level.>
 *     Copyright (C) <2021>  <Smart Tech Solution PVT. LTD.>
 *     This program is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *     This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Affero General Public License for more details.
 *     You should have received a copy of the GNU Affero General Public
 * License along with this program.  If not, see
 * <https://www.gnu.org/licenses/>.
 * Smart Tech Solution Pvt. Ltd.
 * Bhakti Thapa Sadak, New Baneshwor,
 * Kathmandu, Nepal
 * Tel: +977-01-5245027
 * Email: info@smarttech.com.np
 * Website: http://www.smarttech.com.np/
 */

package com.prologic.assetManagement.cashbook.ui


import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.provider.Settings
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.hilt.navigation.fragment.hiltNavGraphViewModels
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.whenResumed
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.ConcatAdapter
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.prologic.assetManagement.BuildConfig
import com.prologic.assetManagement.NavigationCashbookDirections
import com.prologic.assetManagement.R
import com.prologic.assetManagement.cashbook.data.*
import com.prologic.assetManagement.cashbook.ui.home.CashbookHomeFragmentDirections
import com.prologic.assetManagement.databinding.FragmentCashbookBinding
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.util.*
import dagger.hilt.android.AndroidEntryPoint
import timber.log.Timber


/**
 * To show the list of the cashbooks
 * and perorm the CRUD operation in the cashbook
 */
@AndroidEntryPoint
class CashbookFragment : Fragment() {

    private val cashbookViewModel: CashbookViewModel by viewModels()
    lateinit var cashbookType: CashbookType
    lateinit var selectedMonth: String
    lateinit var selectedYear: String

    var _binding: FragmentCashbookBinding? = null
    private val binding get() = _binding!!


    private val cashbookAdapter = CashbookAdapter(
    ) { action: String, cashbook: Cashbook ->
        when (action) {
            "delete" -> {
                showDeleteCashbookDialog(cashbook.id)
            }
            "edit" -> {
                findNavController().navigate(
                    CashbookHomeFragmentDirections.actionShowAddCashbookDialogFragment(
                        cashbookType,
                        cashbook.id,
                        cashbook.category.id,
                        cashbookViewModel.isWeek.value ?: false
                    )
                )
            }
        }
    }
    private val previousToggleAdapter = CashbookToggleAdapter { action ->
        when (action) {
            "swap" -> {
                cashbookViewModel.swapToWeekView(selectedYear, selectedMonth)
            }
            "left" -> {
                cashbookViewModel.reduceWeeks()
            }
            "right" -> {

                cashbookViewModel.increaseWeeks()
            }
            else -> {

            }
        }
    }
    private val previousTotalAdapter = CashbookTotalAdapter()

    private val currentToggleAdapter = CashbookToggleAdapter() { action ->
    }
    private val cashbookTotalAdapter = CashbookTotalAdapter()

    private val concatAdapter = ConcatAdapter()

    lateinit var previousMonthTitle: String
    lateinit var currentMonthTitle: String

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentCashbookBinding.inflate(inflater, container, false)
        val root: View = binding.root
        return root
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        cashbookType = CashbookType.valueOf(arguments?.getString("cashbook")!!)
        selectedMonth = arguments?.getString("selectedMonth")!!
        selectedYear = arguments?.getString("selectedYear")!!
        cashbookViewModel.getPresentPreviousMonthCashbook(cashbookType, selectedYear, selectedMonth)
        cashbookViewModel.refreshCashbooks(cashbookType, false, selectedYear, selectedMonth)

    }

    fun refreshTotals() {
        cashbookViewModel.getPresentPreviousMonthCashbook(cashbookType, selectedYear, selectedMonth)
    }

    fun refreshCashbooks(cashbookType: CashbookType, selectedYear: String, selectedMonth: String) {
        this.selectedMonth = selectedMonth
        this.selectedYear = selectedYear
        cashbookTotalAdapter.submitList(listOf())
        cashbookAdapter.submitList(listOf())
        previousTotalAdapter.submitList(listOf())
        binding.cashbookProgress.show()
        cashbookViewModel.getPresentPreviousMonthCashbook(cashbookType, selectedYear, selectedMonth)
        cashbookViewModel.refreshCashbooks(cashbookType, false, selectedYear, selectedMonth)

    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        previousMonthTitle = getString(R.string.label_from_previous_month)
        currentMonthTitle = getString(R.string.label_total_for) +" "+ getMonthNameFromMonth(selectedMonth.toInt())
        binding.rvCashbook.adapter = concatAdapter

        binding.rvCashbook.setOnClickListener {
            showToast("toasting toasting")
        }

      //  showProgressDialog(getString(R.string.loader_loading))

        cashbookViewModel.isWeek.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                if (it) {
                    setUpWeekAdapter()
                } else {
                    binding.cashbookProgress.show()
                    cashbookAdapter.submitList(listOf())
                    cashbookViewModel.refreshCashbooks(
                        cashbookType,
                        it,
                        selectedYear,
                        selectedMonth
                    )
                    setUpMonthAdapter()
                }
            }
        })

        cashbookViewModel.selectedWeek.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                val range = it.getCurrentWeekRange()
                val startDate = range[0]
                val endDate = range[range.size - 1]
                val dateStr = startDate + "-" + endDate
                Timber.d("the date is:$it")
                Timber.d("the range is:$range")
                previousToggleAdapter.submitList(listOf(CashbookToggle(dateStr, true)))
                binding.cashbookProgress.show()
                cashbookAdapter.submitList(listOf())
                cashbookViewModel.refreshCashbooks(cashbookType, true, selectedYear, selectedMonth)

            }
        })

        cashbookViewModel.previousMonthTotal.observe(viewLifecycleOwner, Observer {
            if (!it.isNullOrEmpty()) {
                previousToggleAdapter.submitList(listOf(CashbookToggle(previousMonthTitle, false)))
                previousTotalAdapter.submitList(listOf(it))
            }
        })

        cashbookViewModel.currentMonthTotal.observe(viewLifecycleOwner, Observer {
            if (it!=null) {
                currentMonthTitle = getMonthNameFromMonth(selectedMonth.toInt())+" "+ getString(R.string.label_total_for)
                currentToggleAdapter.submitList(listOf(CashbookToggle(currentMonthTitle, null)))
                cashbookTotalAdapter.submitList(listOf(it))
            }
        })

        cashbookViewModel.getCashbooks(cashbookType).observe(viewLifecycleOwner, Observer { list ->
            setUpListView(list)
        })


        cashbookViewModel.cashbookResponse.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                cashbookViewModel._cashbookResponse.postValue(null)
                binding.cashbookProgress.hide()
                binding.tvCashbookError.hide()

                when (it) {
                    is ResponseWrapper.Success -> {

                        if (it.value.isEmpty()) {
                            binding.tvCashbookError.show()
                            binding.tvCashbookError.text =
                                getString(R.string.cashbook_empty).replace(
                                    "{cashbookType}",
                                    cashbookType.name
                                )
                                    .replace(
                                        "{monthName}",
                                        selectedYear + " " + getMonthNameFromMonth(selectedMonth.toInt())
                                    )
                        } else {
                            binding.tvCashbookError.hide()

                        }


                    }
                    is ResponseWrapper.GenericError -> {
                        showToast(it.error?.message)
                    }
                    is ResponseWrapper.NetworkError -> {
                        showToast(getString(R.string.error_server))
                    }
                    is ResponseWrapper.NoConnectionError -> {
                        requireContext().showNoConnectionErrorDialog()
                    }
                }
            }
        })


        binding.btnAddCashbook.setOnClickListener {
            findNavController().navigate(
                CashbookHomeFragmentDirections.actionShowAddCashbookDialogFragment(
                    cashbookType,
                    null, null, cashbookViewModel.isWeek.value ?: false
                )
            )
        }

    }


    override fun onDestroy() {
        super.onDestroy()
        _binding = null
    }

    private fun setUpMonthAdapter() {
        concatAdapter.addAdapter(0, previousToggleAdapter)
        concatAdapter.addAdapter(1, previousTotalAdapter)

        concatAdapter.addAdapter(2, cashbookAdapter)

        concatAdapter.addAdapter(3, currentToggleAdapter)
        concatAdapter.addAdapter(4, cashbookTotalAdapter)

        previousToggleAdapter.submitList(listOf(CashbookToggle(previousMonthTitle, false)))
        currentToggleAdapter.submitList(listOf(CashbookToggle(currentMonthTitle, null)))

    }

    private fun setUpWeekAdapter() {
        concatAdapter.removeAdapter(previousTotalAdapter)
        concatAdapter.removeAdapter(currentToggleAdapter)
        concatAdapter.removeAdapter(cashbookTotalAdapter)
    }


    private fun setUpListView(list: List<CashbookUiModel>?) {
        if (list != null) {
            if (list.isNotEmpty()) {

                binding.tvCashbookError.hide()
                cashbookAdapter.submitList(list)
            }
        }
    }

    private fun showDeleteCashbookDialog(id: String) {
        MaterialAlertDialogBuilder(requireContext())
            .setTitle(getString(R.string.delete_cashbook))
            .setMessage(
                getString(R.string.delete_cashbook_message)
            )
            .setPositiveButton(getString(R.string.action_confirm)) { dialog, which ->
                cashbookViewModel.deleteCashbook(
                    cashbookType, selectedYear, selectedMonth,
                    id
                )


            }.setNegativeButton(getString(R.string.action_cancel)) { dialog, which ->

            }
            .show()
    }

}