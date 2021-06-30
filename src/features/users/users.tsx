import React from "react";
import { Table, Spin, Alert } from "antd";
import "antd/dist/antd.css";
import { UserInfo, SortItem, Direction } from "../../services/users-api.service";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { columns } from "./constants";

let sortArr: Array<SortItem> = [];

export default function Users() {
  const dispatch = useDispatch();
  const users: Array<UserInfo> = useSelector((state: any) => state.users.table.data);
  const isHasMore: boolean = useSelector((state: any) => state.users.table.isHasMore);
  const status = useSelector((state: any) => state.users.status);
  const page: number = useSelector((state: any) => state.users.page);
  const [data, setData] = useState<Array<any>>();
  const [isVisibleErrorMsg, setErrorMsgVisibility] = useState(false);
  const [isVisibleSpinner, setSpinnerVisibility] = useState(false);
  useEffect(() => {
    const newData = users.map((item: UserInfo) => {
      return {
        firstName: item.firstName,
        lastName: item.lastName,
        profession: item.profession,
        key: item.id,
      };
    });
    setData(newData);
  }, [users]);
  useEffect(() => {
    if (status === "error") {
      setErrorMsgVisibility(true);
      setTimeout(() => {
        setErrorMsgVisibility(false);
      }, 2000);
    }
    if (status === "loading") {
      setSpinnerVisibility(true);
    } else setSpinnerVisibility(false);
  }, [status]);

  useEffect(() => {
    dispatch({ type: "USERS_FETCH_REQUESTED", payload: { page: 1, sort: sortArr } });
  }, []);

  function onChange(pagination: any, filters: any, sorter: any, extra: any) {
    let fieldIndex = -1;
    sortArr.find((item, index) => {
      if (item.field === sorter.field) {
        fieldIndex = index;
        return true;
      }
    });
    if (fieldIndex > -1) sortArr.splice(fieldIndex, 1);
    if (sorter.order) {
      const sortItem: SortItem = {
        direction: sorter.order === "ascend" ? Direction.asc : Direction.desc,
        field: sorter.field,
      };
      sortArr.push(sortItem);
    }
    dispatch({ type: "USERS_FETCH_REQUESTED", payload: { page: 1, sort: sortArr } });
  }
  function onScroll(event: any) {
    const scrollTop: number = event.target.scrollTop;
    const clientHeight: number = event.target.clientHeight;
    const scrollHeight: number = event.target.scrollHeight;
    const fullScrollHeight: number = Math.round(scrollTop + clientHeight);
    const isScrollBottom = fullScrollHeight >= scrollHeight;
    if (isScrollBottom && isHasMore) {
      dispatch({ type: "USERS_FETCH_REQUESTED", payload: { page: page + 1, sort: sortArr } });
    }
  }
  return (
    <div style={{ maxHeight: "340px", overflow: "auto", padding: "40px" }} onScroll={onScroll}>
      <Table
        dataSource={data}
        columns={columns}
        onChange={onChange}
        pagination={false}
        showSorterTooltip={true}
      />
      <Spin
        size="large"
        style={{
          display: isVisibleSpinner ? "block" : "none",
          position: "absolute",
          left: "50%",
          top: "50%",
        }}
      />
      <Alert
        message="Error"
        type="error"
        showIcon
        style={{
          display: isVisibleErrorMsg ? "block" : "none",
        }}
      />
    </div>
  );
}
