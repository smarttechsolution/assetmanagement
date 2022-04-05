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

package com.prologic.assetManagement.cashbook.ui.add


import android.graphics.Color
import android.os.Bundle
import android.text.InputType
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.TextView
import androidx.core.view.isVisible
import androidx.fragment.app.Fragment
import androidx.hilt.navigation.fragment.hiltNavGraphViewModels
import androidx.navigation.fragment.navArgs
import com.prologic.assetManagement.R
import com.prologic.assetManagement.base.BaseDialog
import com.prologic.assetManagement.cashbook.data.CashbookCategory
import com.prologic.assetManagement.cashbook.data.CashbookType
import com.prologic.assetManagement.cashbook.ui.CashbookFragment
import com.prologic.assetManagement.databinding.FragmentAddCashbookDialogBinding
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.util.*
import dagger.hilt.android.AndroidEntryPoint
import timber.log.Timber


/**
 * To add income and expense
 */
@AndroidEntryPoint
class AddCashbookDialogFragment : BaseDialog(), AdapterView.OnItemSelectedListener {


    private val cashbookViewModel: AddCashbookViewModel by hiltNavGraphViewModels(R.id.navigation_cashbook)

    val args by navArgs<AddCashbookDialogFragmentArgs>()

    private var _binding: FragmentAddCashbookDialogBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentAddCashbookDialogBinding.inflate(inflater, container, false)
        val root: View = binding.root
        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        isCancelable = false
        when (args.cashbookType){
             CashbookType.INCOME -> binding.labelAddCashbook.text = getString(R.string.action_add_income)
             CashbookType.EXPENDITURE -> binding.labelAddCashbook.text = getString(R.string.action_add_expense)
        }
        cashbookViewModel.getCategory(args.cashbookType)

        when (args.cashbookType) {
            CashbookType.INCOME -> {
               // binding.etWaterSupply.setText("0")
                binding.etRemarks.hide()
                binding.etWaterSupply.inputType = InputType.TYPE_CLASS_NUMBER
                binding.etIncomeTitle.hint = getString(R.string.add_cashbook_income_title)
                binding.etIncomeAmount.hint = getString(R.string.add_cashbook_income_amount)
            }
            CashbookType.EXPENDITURE -> {
                binding.etRemarks.show()
                binding.etWaterSupply.hide()
                binding.etWaterSupply.inputType = InputType.TYPE_CLASS_TEXT
                binding.etIncomeTitle.hint = getString(R.string.add_cashbook_expense_title)
                binding.etIncomeAmount.hint = getString(R.string.add_cashbook_expense_amount)


            }
        }

        cashbookViewModel.categories.observe(viewLifecycleOwner, androidx.lifecycle.Observer {
            if (!it.isNullOrEmpty()) {

                val namesList: MutableList<String> = it.map { it.name }.toMutableList()
                Timber.d("the names list is:" + namesList.size)
                namesList.add(0, getString(R.string.add_cashbook_select_category))

                Timber.d("the size now is:" + namesList.size)
                val spinnerAdapter: ArrayAdapter<String> = object : ArrayAdapter<String>(
                    requireContext(),
                    R.layout.item_simple_spinner,
                    namesList
                ) {

                    override fun isEnabled(position: Int): Boolean {
                        return position != 0
                    }


                    override fun getDropDownView(
                        position: Int, convertView: View?,
                        parent: ViewGroup?
                    ): View? {
                        val view = super.getDropDownView(position, convertView, parent)
                        val tv = view as TextView
                        if (position == 0) {
                            // Set the hint text color gray
                            tv.setTextColor(Color.GRAY)
                        } else {
                            tv.setTextColor(Color.BLACK)
                        }
                        return view
                    }
                }
                binding.spinnerCategory.onItemSelectedListener = this
                binding.spinnerCategory.adapter = spinnerAdapter

                if (args.cashbookId != null && args.categoryId != null) {
                    val item = it.find { it.id == args.categoryId }
                    val index = it.indexOf(item)
                    index.let {
                        binding.spinnerCategory.setSelection(it + 1)
                    }
                }


            }
        })
        args.cashbookId?.let {
            cashbookViewModel.getCashbook(it)
                .observe(viewLifecycleOwner, androidx.lifecycle.Observer { cashbook ->
                    if (cashbook != null) {
                        binding.etIncomeAmount.setText(cashbook.amount.toString())
                        binding.etIncomeTitle.setText(cashbook.title)
                        binding.btnSelectDate.text = cashbook.dateEn
                        binding.etWaterSupply.setText(cashbook.waterSupplied)
                        cashbookViewModel.selectedDate = cashbook.dateEn

                    }
                })
        }
        binding.btnActionSave.setOnClickListener {
            cashbookViewModel.incomeTitle = binding.etIncomeTitle.text.toString()
            cashbookViewModel.waterSupplied = binding.etWaterSupply.text.toString()
            cashbookViewModel.remarks = binding.etRemarks.text.toString()

            var extraCost = false
            if (binding.groupExtraCost.isVisible) {
                extraCost = true
                var labourCost = binding.etLabour.text.toString()
                var replacementCost = binding.etReplacementCost.text.toString()
                var materialCost = binding.etMaterial.text.toString()
                if (materialCost.isNotEmpty())
                    cashbookViewModel.materialAmount = materialCost
                if (replacementCost.isNotEmpty())
                    cashbookViewModel.replacementAmount = replacementCost
                if (labourCost.isNotEmpty())
                    cashbookViewModel.labourAmount = labourCost
            } else {
                extraCost = false
                cashbookViewModel.incomeAmount = binding.etIncomeAmount.text.toString()

            }

            val valid = if (args.cashbookType == CashbookType.INCOME)
                cashbookViewModel.validateAddIncomeCashbook()
            else
                cashbookViewModel.validateAddExpenseCashbook(extraCost)

            if (valid.valid) {
                showProgressDialog(getString(R.string.loader_loading))
                if (args.cashbookId == null) {
                    cashbookViewModel.addCashbook(args.cashbookType, args.isWeek, extraCost)
                } else {
                    cashbookViewModel.editCashbook(
                        args.cashbookId ?: "",
                        args.cashbookType,
                        args.isWeek,
                        extraCost
                    )
                }
            } else {
                showToast(getString(valid.message))
            }

        }
        binding.btnActionCancel.setOnClickListener {
            dismiss()
        }

        cashbookViewModel.addCashbookResponse.observe(
            viewLifecycleOwner,
            androidx.lifecycle.Observer {
                if (it != null) {
                    cashbookViewModel._addCashbookResponse.postValue(null)
                    hideProgressDialog()
                    when (it) {
                        is ResponseWrapper.Success -> {

                            val fragments: List<Fragment>? =
                                activity?.supportFragmentManager?.fragments
                            Timber.d("the fragments is:" + fragments?.size)
                            fragments?.map { fragment ->
                                Timber.d("the frgment is:" + fragment)
                                if (fragment is CashbookFragment) {
                                    fragment.refreshTotals()
                                }

                            }

                            dismiss()
                        }
                        is ResponseWrapper.GenericError -> {
                            showToast(it.error?.message)
                        }
                        is ResponseWrapper.NoConnectionError ->
                            requireContext().showNoConnectionErrorDialog()
                        else -> {
                            showToast(getString(R.string.error_server))
                        }
                    }
                }
            })

        binding.btnSelectDate.setOnClickListener {
            showDatePicker() {
                cashbookViewModel.selectedDate = it
                binding.btnSelectDate.text = it

            }
        }


    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

    override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        if (position > 0) {

            (parent!!.getChildAt(0) as TextView).setTextColor(Color.BLACK)
            val categoryList: List<CashbookCategory>? = cashbookViewModel.categories.value
            val item = categoryList?.elementAt(position - 1)
            item?.let {

                if (args.cashbookType == CashbookType.EXPENDITURE) {
                    if (it.eName?.equals("Maintenance") == true) {
                        showSegregatedCost()
                    } else {
                        hideSegregatedCost()
                    }
                } else if (args.cashbookType == CashbookType.INCOME) {
                    if (it.eName?.equals("Water Sales") == true) {
                        showWaterSupply()
                    } else {
                        hideWaterSupply()
                    }

                }
                cashbookViewModel.selectedCategory = it
            }
        } else {
            cashbookViewModel.selectedCategory = null
        }
    }


    override fun onNothingSelected(parent: AdapterView<*>?) {

    }

    private fun showWaterSupply() {
        binding.groupWaterSupply.show()

    }

    private fun hideWaterSupply() {
        binding.groupWaterSupply.hide()
    }

    private fun showSegregatedCost() {
        binding.etIncomeAmount.setHint(getString(R.string.add_cashbook_expense_maintenance_amount))
        binding.groupExtraCostCb.show()

        binding.cbAddExtraCost.setOnCheckedChangeListener { compoundButton, b ->
            if (b) {
                binding.etIncomeAmount.setText("")
                binding.groupExtraCost.show()
                binding.etIncomeAmount.hide()
            } else {
                binding.etLabour.setText("")
                binding.etMaterial.setText("")
                binding.etReplacementCost.setText("")
                binding.groupExtraCost.hide()
                binding.etIncomeAmount.show()
            }
        }

    }

    private fun hideSegregatedCost() {
        binding.etIncomeAmount.setHint(getString(R.string.add_cashbook_expense_amount))
        cashbookViewModel.replacementAmount = null
        cashbookViewModel.labourAmount = null
        cashbookViewModel.materialAmount = null
        binding.groupExtraCost.hide()
        binding.etIncomeAmount.show()
    }
}