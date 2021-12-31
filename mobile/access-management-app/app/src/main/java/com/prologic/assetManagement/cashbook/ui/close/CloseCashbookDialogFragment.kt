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

package com.prologic.assetManagement.cashbook.ui.close

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.net.toUri
import androidx.hilt.navigation.fragment.hiltNavGraphViewModels
import androidx.lifecycle.Observer
import androidx.navigation.fragment.navArgs
import com.prologic.assetManagement.R
import com.prologic.assetManagement.base.BaseDialogMultimediaFragment
import com.prologic.assetManagement.databinding.FragmentCashbookHomeBinding
import com.prologic.assetManagement.databinding.FragmentCloseCashbookDialogBinding
import com.prologic.assetManagement.network.ResponseWrapper
import com.prologic.assetManagement.util.*
import java.io.File

/**
 * To close the cashbook
 */
class CloseCashbookDialogFragment : BaseDialogMultimediaFragment(), BaseDialogMultimediaFragment.MultimediaListener{

    private var _binding: FragmentCloseCashbookDialogBinding? = null
    private val binding get() = _binding!!
    val args:CloseCashbookDialogFragmentArgs by navArgs()

    private val cashbookImageAdapter = CashbookImageAdapter()
 val viewModel:CloseCashbookViewModel by hiltNavGraphViewModels(R.id.navigation_cashbook)
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        _binding = FragmentCloseCashbookDialogBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onDestroy() {
        super.onDestroy()
        _binding = null
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.btnSelectPicture.setOnClickListener {
            lunchMultipleImageSelections()
        }
        binding.btnCapturePicture.setOnClickListener {
            launchCapturePicture()
        }
        binding.btnCancel.setOnClickListener {
            dismiss()
        }

        viewModel.actionResponse.observe(viewLifecycleOwner, Observer {
            if(it!=null){
                hideProgressDialog()
                viewModel._actionResponse.postValue(null)
                when(it){
                    is ResponseWrapper.Success->{
                        showToast(getString(R.string.response_save_data_success))
                        dismiss()
                    }
                    is ResponseWrapper.NetworkError->{
                        showToast(getString(R.string.error_no_internet))
                    }
                    is ResponseWrapper.GenericError->{
                        showToast((it.error?.message))
                    }
                    is ResponseWrapper.NoConnectionError-> requireContext().showNoConnectionErrorDialog()

                }
            }
        })

        binding.btnConfirm.setOnClickListener {
            showProgressDialog(getString(R.string.loader_loading))
            viewModel.closeCashbook(args.date)
        }
        binding.labelClosCashbookTitle.text = getString(R.string.close_cashbook_dialog_title) + args.date
        binding.rvSelectedImage.adapter = cashbookImageAdapter
    }


    override fun onImageSelected(selectedFile: List<File?>?) {

        selectedFile?.let {
            viewModel.files = it
           cashbookImageAdapter.submitList(it.map { it?.toUri() })
        }
    }


}