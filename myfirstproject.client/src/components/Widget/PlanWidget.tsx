import { Button } from "antd";

export const PlanWidget = ({data}: {data: any}) => {
    return (
        <Button type="primary" onClick={()=>{
            console.log(data)
        }}>Plan Widget</Button>
    )
}