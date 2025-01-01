import React, { useState, useEffect } from "react";
import {
  GridComponent,
  Inject,
  ColumnsDirective,
  ColumnDirective,
  Search,
  Page,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import { Header } from "../components";

const Wallets = ({ title, walletAddress }) => {
  const [scannerData, setScannerData] = useState([]);

  // 트랜잭션 데이터를 가져오는 함수
  useEffect(() => {
    const fetchTransactions = async () => {
      const tokenAddress = "BQahSAUsvEkMS46WX2qktMTP3qutuECxNT2uWxRjZTF2"; // 토큰 주소
      const requestOptions = {
        method: "get",
        headers: {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3MzU3MjYwMTk4ODAsImVtYWlsIjoiY2xvdWRAYmxieC5vbmUiLCJhY3Rpb24iOiJ0b2tlbi1hcGkiLCJhcGlWZXJzaW9uIjoidjIiLCJpYXQiOjE3MzU3MjYwMTl9.df0mJYiIn9pyT_wvGSFOO4-LoFeuBpBtgS7hGRKFsDE",
        },
      };

      try {
        const response = await fetch(
          `https://pro-api.solscan.io/v2.0/account/transfer?address=${walletAddress}&token=${tokenAddress}&page=1&page_size=10&sort_by=block_time&sort_order=desc`,
          requestOptions
        );
        const data = await response.json();

        // 데이터 형식 변환
        const formattedData = data.data.map((item) => ({
          transactionId: item.trans_id,
          blockId: item.block_id,
          fromAddress: item.from_address || "Mint",
          toAddress: item.to_address,
          amount: item.amount / Math.pow(10, item.token_decimals), // Decimals 적용
          flow: item.flow,
          timestamp: new Date(item.block_time * 1000).toLocaleString(),
        }));

        setScannerData(formattedData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [walletAddress]);

  // Solscan 링크 템플릿
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
  const scannerGrid = [
    { field: "transactionId", headerText: "Transaction ID", width: "250", textAlign: "Left", template: transactionLinkTemplate },
    { field: "blockId", headerText: "Block ID", width: "100", textAlign: "Left" },
    { field: "fromAddress", headerText: "From", width: "200", textAlign: "Left" },
    { field: "toAddress", headerText: "To", width: "200", textAlign: "Left" },
    { field: "amount", headerText: "Amount", width: "100", textAlign: "Right" },
    { field: "flow", headerText: "Flow", width: "100", textAlign: "Left" },
    { field: "timestamp", headerText: "Timestamp", width: "150", textAlign: "Left" },
  ];

  const toolbarOptions = ["Search"];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl shadow-2xl">
      <Header category="Page" title={title} />
      <p className="text-lg font-semibold mt-4">
        Address: {walletAddress}
      </p>
      <GridComponent
        dataSource={scannerData}
        width="auto"
        allowPaging
        allowSorting
        pageSettings={{ pageCount: 5 }}
        toolbar={toolbarOptions}
      >
        <ColumnsDirective>
          {scannerGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Search, Page, Toolbar]} />
      </GridComponent>
    </div>
  );
};

export default Wallets;
