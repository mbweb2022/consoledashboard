import { Modal, Space, DatePicker, Select, Tag } from "antd"
import dayjs from "dayjs";
import { useEffect, useState } from "react";
const { RangePicker } = DatePicker;

export const DownloadUsersModal = ({ isVisibleModalUsers, setIsVisibleModalUsers }) => {
    const [rangeDate, setRangeDate] = useState([null, null])
    const [filterValue, setFilterValue] = useState(["ALL"])
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [isNotValidForm, setIsNotValidForm] = useState(true)
    const [filterOptions] = useState([
        {
            value: "ALL",
            label: "Todos"
        },
        {
            value: "APPROVED",
            label: "Aprobados"
        },
        {
            value: "DENIED",
            label: "Rechazados"
        }, {
            value: "USA",
            label: "Estados Unidos"
        }, {
            value: "ECU",
            label: "Ecuador"
        }
    ])
    useEffect(() => {
        setRangeDate(loadInitDate())
    }, [])
    useEffect(() => {
        if (filterValue.length > 0 && rangeDate[0] && rangeDate[1]) {
            setIsNotValidForm(false)
        } else {
            setIsNotValidForm(true)
        }
    }, [rangeDate, filterValue])
    const loadInitDate = () => {
        try {
            const currentTimeSeconds = (new Date().getTime() - (60000 * 10080));
            console.log("past date", new Date(currentTimeSeconds - 604800).toISOString())
            return [dayjs(new Date(currentTimeSeconds - 604800).toISOString().split("T")[0]), dayjs(new Date().toISOString().split("T")[0], 'YYYY-MM-DD')]
        } catch (e) {
            return [null, null]
        }
    }
    const handleChangeDate = (values) => {
        try {
            let rangeTmp = rangeDate
            if (values && values[0]) {
                rangeTmp[0] = dayjs(values[0].toISOString().split("T")[0], 'YYYY-MM-DD')
            }
            if (values && values[1]) {
                rangeTmp[1] = dayjs(values[1].toISOString().split("T")[0], 'YYYY-MM-DD')
            }
            setRangeDate(rangeTmp)
        } catch (e) {
            setRangeDate([null, null])
            console.log("error", e)
        }
    }
    const handleSelectChange = (values) => {
        if (values.includes("ALL") || (values.length == filterOptions.length - 1)) {
            setFilterValue(["ALL"])
        } else {
            setFilterValue(values)
        }
    };
    const onDownloadUserFile = async () => {
        setConfirmLoading(true);
        const response = await axios.post(
            "https://sy49h7a6d4.execute-api.us-east-1.amazonaws.com/production",
            {
                type: "LIST_USERS_DOWNLOAD",
                pathNames: [row.name],
            }
        );
        console.log("response fronm", response.data)
        setConfirmLoading(false);

    }
    return <Modal
        title="Descargar usuarios"
        open={isVisibleModalUsers}
        okText="Descargar"
        cancelText="Cancelar"
        onOk={onDownloadUserFile}
        confirmLoading={confirmLoading}
        cancelButtonProps={{ disabled: confirmLoading }}
        okButtonProps={{ disabled: isNotValidForm }}
        onCancel={() => {
            setFilterValue(["ALL"])
            setRangeDate(loadInitDate())
            setIsVisibleModalUsers(false)
        }}
    >
        <p>Completa la siguiente información para proceder con la descarga</p>
        <Space direction="vertical" size={12} style={{ marginTop: 20 }}>
            <RangePicker
                onCalendarChange={handleChangeDate}
                value={rangeDate}
            />
            <Select
                mode="multiple"
                defaultValue={["ALL"]}
                style={{ width: '100%' }}
                onChange={handleSelectChange}
                options={filterOptions}
                value={filterValue}
            />

        </Space>
    </Modal>
}