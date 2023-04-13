import React from 'react'
import { connect } from 'react-redux';
import { useTranslation } from "react-i18next";
import { getNumberByLanguage } from "i18n/i18n";

const Note = (props) => {

  const { t } = useTranslation();

  return (
    <div className='note-'>
      <h4 className='note-header'>{t("finance:howEPCWork")}</h4>
      <table className='note-table'>
        <thead>
          <tr>
            <th>{t("finance:unitRange")}</th>
            <th>{t("finance:pobur")}</th>
            <th>EPC</th>
            <th>{t("finance:description")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{t("finance:0-10")}<br />{t("finance:minimumunit")}</td>
            <td>{t("finance:pobur")}:{getNumberByLanguage(35)}%</td>
            <td>{getNumberByLanguage(30)}%</td>
            <td>{t("finance:epcCal50")}</td>
          </tr>
          <tr>
            <td>{t("finance:11-15")}</td>
            <td>{t("finance:pobur")}:{getNumberByLanguage(20)}%</td>
            <td>{getNumberByLanguage(15)}%</td>
            <td>{t("finance:epcCal25")}</td>
          </tr>
          <tr>
            <td>{t("finance:16-20")}</td>
            <td>{t("finance:pobur")}:{getNumberByLanguage(30)}%</td>
            <td>{getNumberByLanguage(25)}%</td>
            <td>{t("finance:epcCal15")}</td>
          </tr>
          <tr>
            <td>{t("finance:21-30")}</td>
            <td>{t("finance:pobur")}:{getNumberByLanguage(15)}%</td>
            <td>{getNumberByLanguage(10)}%</td>
            <td>{t("finance:epcCal10")}</td>
          </tr>
          <tr>
            <td>{t("finance:totalnumofben")}:{getNumberByLanguage(140)}</td>
            <td>{t("finance:users")}:{getNumberByLanguage(100)}% <br />{t("finance:epctotal")}:{getNumberByLanguage(80)}% </td>
            <td>-</td>
            <td style={{textAlign: "start"}}>{t("finance:note")}
              <ol>
                <li>{t("finance:note1")}</li>
                <li>{t("finance:note2")}</li>
              </ol>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Note)