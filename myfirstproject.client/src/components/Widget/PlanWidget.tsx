import { Button } from "antd";
import { usePlanModalStore } from "../../stores/usePlanModalStore";

export const PlanWidget = ({data}: {data: any}) => {
    const { openModal } = usePlanModalStore();

    const handleOpenCreate = () => {
        openModal("create",undefined, data);
    }

    return (
        <Button type="primary" onClick={()=>{
            console.log(data)
            handleOpenCreate()
        }}>Plan Widget</Button>
    )
}