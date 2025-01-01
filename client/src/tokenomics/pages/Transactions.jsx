import React, { useState, useEffect } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  ExcelExport,
  PdfExport,
  Inject,
  Toolbar,
} from "@syncfusion/ej2-react-grids";

import { Header } from "../components";

const Transactions = () => {
  const [transactionsData, setTransactionsData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const requestOptions = {
        method: "get",
        headers: {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3MzU3MjYwMTk4ODAsImVtYWlsIjoiY2xvdWRAYmxieC5vbmUiLCJhY3Rpb24iOiJ0b2tlbi1hcGkiLCJhcGlWZXJzaW9uIjoidjIiLCJpYXQiOjE3MzU3MjYwMTl9.df0mJYiIn9pyT_wvGSFOO4-LoFeuBpBtgS7hGRKFsDE",
        },
      };

      try {
        const response = await fetch(
          "https://pro-api.solscan.io/v2.0/token/transfer?address=BQahSAUsvEkMS46WX2qktMTP3qutuECxNT2uWxRjZTF2&page=1&page_size=10&sort_by=block_time&sort_order=desc",
          requestOptions
        );
        const data = await response.json();

        const formattedData = data.data.map((item) => ({
          transactionId: item.trans_id,
          blockId: item.block_id,
          fromAddress: item.from_address,
          toAddress: item.to_address,
          amount: item.amount / Math.pow(10, item.token_decimals),
          timestamp: new Date(item.block_time * 1000).toLocaleString(),
        }));

        setTransactionsData(formattedData);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchTransactions();
  }, []);

  // 링크 템플릿
  const transactionLinkTemplate = (props) => (
    <a
      href={`https://solscan.io/tx/${props.transactionId}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "blue", textDecoration: "underline" }}
    >
      {props.transactionId}
    </a>
  );

  // Grid 컬럼 정의
  const transactionsGrid = [
    { field: "transactionId", headerText: "Transaction ID", width: "250", textAlign: "Left", template: transactionLinkTemplate },
    { field: "blockId", headerText: "Block ID", width: "100", textAlign: "Left" },
    { field: "fromAddress", headerText: "From", width: "200", textAlign: "Left" },
    { field: "toAddress", headerText: "To", width: "200", textAlign: "Left" },
    { field: "amount", headerText: "Amount", width: "100", textAlign: "Right" },
    { field: "timestamp", headerText: "Timestamp", width: "150", textAlign: "Left" },
  ];

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl shadow-2xl">
      <Header category="Page" title="Transactions" />
      <GridComponent
        id="gridComp"
        dataSource={transactionsData}
        allowPaging={true}
        allowSorting={true}
        toolbar={["Search"]}
      >
        <ColumnsDirective>
          {transactionsGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject
          services={[
            Resize,
            Sort,
            ContextMenu,
            Filter,
            Page,
            Toolbar,
            ExcelExport,
            PdfExport,
          ]}
        />
      </GridComponent>
    </div>
  );
};

export default Transactions;
