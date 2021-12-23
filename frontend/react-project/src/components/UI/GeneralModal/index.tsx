import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { GeneralCard } from "../GeneralCard";
import "./GeneralModal.scss";
import Image from "assets/images/xd/cash.png";
interface Props {
  open: boolean;
  toggle: () => void;
  title?: string;
  children?: any;
  size?: string
}

const GeneralModal = (props: Props) => {
  return (
    <div className="modal generalModal">
      <Modal
        isOpen={props.open}
        toggle={props.toggle}
        className={""}
        backdrop={true}
        centered
        size={props.size ||"xl"}
      >
        <div className="p-4">
          {props.title && (
            <div className="generalModal-header">
              <h3 className="generalModal-header-title">{props.title}</h3>
            </div>
          )}
          <div className="generalModal-body">{props.children}</div>
        </div>
      </Modal>
    </div>
  );
};

export default GeneralModal;
