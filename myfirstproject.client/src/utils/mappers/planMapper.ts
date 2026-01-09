import dayjs from "dayjs";
import type { PlanResponse } from "../../services/planService";

export const planMappers = {
  // Chuyển dữ liệu từ Form (AntD) -> API Payload (JSON)
  toApiPayload: (values: any) => {
    const payload: any = {
      title: values.title,
      description: values.description,
      startDate: values.dateRange ? values.dateRange[0].toISOString() : null,
      endDate: values.dateRange ? values.dateRange[1].toISOString() : null,
    };

    // Xử lý phases nếu có
    if (values.phases && Array.isArray(values.phases)) {
      payload.phases = values.phases.map((phase: any) => ({
        id: phase.id ?? null,
        title: phase.title,
        description: phase.description,
        startDate: phase.startDate ? phase.startDate.toISOString() : null,
        endDate: phase.endDate ? phase.endDate.toISOString() : null,
        // Xử lý goals cho mỗi phase
        goals:
          phase.goals && Array.isArray(phase.goals)
            ? phase.goals.map((goal: any) => ({
                type: goal.type,
                name: goal.name,
                start: Number(goal.start),
                target: Number(goal.target),
                current:
                  goal.current !== undefined
                    ? Number(goal.current)
                    : Number(goal.start),
              }))
            : [],
      }));
    }

    return payload;
  },
  // Chuyển dữ liệu từ API (JSON) -> Form Values (AntD)
  toFormValues: (plan: PlanResponse) => {
    const dateRange = [];
    if (plan.startDate && plan.endDate) {
      dateRange.push(dayjs(plan.startDate), dayjs(plan.endDate));
    }

    const formValues: any = {
      title: plan.title,
      description: plan.description,
      dateRange: dateRange.length === 2 ? dateRange : null,
      endDate: plan.endDate ? dayjs(plan.endDate) : null,
    };

    if (plan.phases && Array.isArray(plan.phases)) {
      formValues.phases = plan.phases.map((phase) => {
        const phaseDateRange = [];
        if (phase.startDate && phase.endDate) {
          phaseDateRange.push(dayjs(phase.startDate), dayjs(phase.endDate));
        }
        const phaseValues: any = {
          title: phase.title,
          description: phase.description,
          startDate: phase.startDate ? dayjs(phase.startDate) : null,
          endDate: phase.endDate ? dayjs(phase.endDate) : null,
        };
        if (phaseDateRange.length === 2) {
          phaseValues.dateRange = phaseDateRange;
        }
        // Xử lý goals
        if (phase.goals && Array.isArray(phase.goals)) {
          phaseValues.goals = phase.goals.map((goal) => ({
            type: goal.type,
            name: goal.name,
            start: goal.start,
            target: goal.target,
            current: goal.current,
          }));
        }
        return phaseValues;
      });
    }
    return formValues;
  },
};
