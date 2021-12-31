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

package com.prologic.assetManagement.cashbook.ui.home

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.os.bundleOf
import androidx.core.view.get
import androidx.fragment.app.viewModels
import androidx.hilt.navigation.fragment.hiltNavGraphViewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.findNavController
import com.google.android.material.tabs.TabLayoutMediator
import com.prologic.assetManagement.NavigationCashbookDirections
import com.prologic.assetManagement.R
import com.prologic.assetManagement.cashbook.data.CashbookType
import com.prologic.assetManagement.cashbook.ui.CashbookFragment
import com.prologic.assetManagement.cashbook.ui.CashbookPagerAdapter
import com.prologic.assetManagement.databinding.FragmentCashbookHomeBinding
import com.prologic.assetManagement.util.*
import dagger.hilt.android.AndroidEntryPoint
import timber.log.Timber
import java.util.*

@AndroidEntryPoint
class CashbookHomeFragment : Fragment() {
    private var _binding: FragmentCashbookHomeBinding? = null
    private val binding get() = _binding!!
    val viewmodel: CashbookHomeViewModel by viewModels()
    val cashbooks = CashbookType.values()

    lateinit var fragments: List<CashbookFragment>
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate the layout for this fragment
        _binding = FragmentCashbookHomeBinding.inflate(inflater, container, false)
        return binding.root

    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)


        viewmodel.selectedMonth.observe(viewLifecycleOwner, Observer {
            if (it != null) {
                binding.btnShowDate.text = it.year + ", " + getMonthNameFromMonth(it.month.toInt())
                binding.btnClose.text = getString(R.string.action_close)+ " "+getMonthNameFromMonth(it.month.toInt())

                if (binding.viewPagerCashbook.adapter == null) {
                    setUpViewPager(it.year, it.month)
                } else {

                    val fragments: List<Fragment>? = activity?.supportFragmentManager?.fragments
                    Timber.d("the fragments is:" + fragments?.size)
                    fragments?.map { fragment ->
                        Timber.d("the frgment is:" + fragment)
                        if (fragment is CashbookFragment) {
                            fragment.refreshCashbooks(fragment.cashbookType, it.year, it.month)
                        }

                    }

                }


                Timber.d("the selected month is:" + viewmodel.selectedMonth.value?.month)
                val items = viewmodel.closedBooks.filter { closedBooks ->
                    val dateEnMonth = closedBooks.dateEn.substring(5, 7)
                    Timber.d("the dateEn is:" + dateEnMonth)
                    dateEnMonth.equals(it.month)
                }
                if (items.size > 0) {
                    binding.btnClose.hide()
                } else {
                    binding.btnClose.show()

                }

            }
        })


        binding.btnClose.setOnClickListener {
            val date = viewmodel.selectedMonth.value?.let {
                it.year + "-" + it.month + "-01"
            }
            findNavController().navigate(
                CashbookHomeFragmentDirections.actionShowCloseCashbookDialog(
                    date ?: Date().getServerDateFormat()
                )
            )
        }


        binding.btnLeft.setOnClickListener {
            viewmodel.decreaseDateCount()
        }

        binding.btnRight.setOnClickListener {
            viewmodel.increaseDateCount()
        }


    }

    fun getCashbookFragment(
        cashbookType: CashbookType,
        selectedYear: String,
        selectedMonth: String
    ): CashbookFragment {
        val cashbookFragment = CashbookFragment()
        cashbookFragment.arguments = bundleOf(
            "cashbook" to cashbookType.name,
            "selectedYear" to selectedYear,
            "selectedMonth" to selectedMonth
        )
        return cashbookFragment
    }

    private fun setUpViewPager(year: String, month: String) {

        binding.viewPagerCashbook.offscreenPageLimit = 2
        fragments = listOf<CashbookFragment>(
            getCashbookFragment(CashbookType.INCOME, year, month),
            getCashbookFragment(CashbookType.EXPENDITURE, year, month)
        )

        val adapter = CashbookPagerAdapter(requireActivity(), fragments)

        binding.viewPagerCashbook.adapter = adapter
        TabLayoutMediator(
            binding.tabLayoutCashbook,
            binding.viewPagerCashbook
        ) { tab, position ->
            when (position) {
                0 -> {
                    tab.text = getString(R.string.tab_income)
                }
                1 -> {
                    tab.text = getString(R.string.tab_expenditure)
                }

            }

        }.attach()
    }


    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }

}