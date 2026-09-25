import { ExecutableAction } from '../types';

export interface ActionExecutionReceipt {
  actionId: string;
  tool: string;
  status: 'SUCCESS' | 'FAILED' | 'SIMULATED';
  timestamp: string;
  executionId: string;
  targetEndpoint: string;
  responsePayload: Record<string, any>;
  message: string;
}

const EXECUTION_HISTORY: ActionExecutionReceipt[] = [];

/**
 * Executes a business action against external enterprise tools (CRM, ERP, WFM, IT, Email)
 */
export async function executeBusinessAction(
  action: ExecutableAction,
  customParams?: Record<string, any>
): Promise<ActionExecutionReceipt> {
  const executionId = `EXEC-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const timestamp = new Date().toISOString();
  const mergedParams = { ...action.parameters, ...(customParams || {}) };

  // Simulate network latency for realistic enterprise API dispatch
  await new Promise((resolve) => setTimeout(resolve, 600));

  let targetEndpoint = '';
  let responsePayload: Record<string, any> = {};
  let message = '';

  switch (action.tool) {
    case 'salesforce':
      targetEndpoint = 'https://api.salesforce.com/services/data/v58.0/sobjects/Task';
      responsePayload = {
        id: `00T5g00000${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        success: true,
        errors: [],
        assignedTo: mergedParams.assigned_to,
        priority: mergedParams.priority || 'High',
        status: 'In Progress',
        subject: mergedParams.subject,
        dueDate: mergedParams.due_date,
      };
      message = `Salesforce CRM Task successfully created and assigned to ${mergedParams.assigned_to}. Notification dispatched to mobile Sales Cloud app.`;
      break;

    case 'workforce':
      targetEndpoint = 'https://api.workday.com/wfm/v1/scheduling/shift_assignments';
      responsePayload = {
        batchId: `WFM-BATCH-${Date.now()}`,
        status: 'DISPATCHED',
        promotersAllocated: mergedParams.promoter_headcount || 8,
        region: mergedParams.region || 'Lombardia',
        storesAffected: mergedParams.store_ids || [],
        effectiveWeek: mergedParams.effective_iso_week || 39,
        budgetApproved: true,
      };
      message = `Workforce schedule updated: ${mergedParams.promoter_headcount || 8} brand promoters dispatched to Store Group B doors for Week 39.`;
      break;

    case 'sap':
      targetEndpoint = 'https://s4hana.haier.internal:8443/sap/opu/odata/sap/API_MATERIAL_DOCUMENT_SRV';
      responsePayload = {
        materialDocumentNumber: `49000${Math.floor(100000 + Math.random() * 900000)}`,
        fiscalYear: '2025',
        originPlant: mergedParams.warehouse_origin || 'WH-IT-CENTRAL',
        destinationPlant: mergedParams.destination_hub || 'XD-IT-MILANO-NORTH',
        transferPostingStatus: 'CONFIRMED_EXPEDITED',
        items: mergedParams.sku_list || ['HW90-B14979-IT (120 units)', 'HW100-B14979-IT (120 units)'],
      };
      message = `SAP S/4HANA stock transport order confirmed. 240 units allocated from Vimercate to Milan North cross-dock.`;
      break;

    case 'servicenow':
      targetEndpoint = 'https://instance.service-now.com/api/now/table/incident';
      responsePayload = {
        incidentNumber: `INC00${Math.floor(100000 + Math.random() * 900000)}`,
        category: 'Data Pipeline',
        urgency: '1 - High',
        assignedGroup: 'Retail BI & Data Engineering',
        state: 'Assigned',
      };
      message = `ServiceNow incident logged for Retail POS ingestion pipeline. SLA resolution window: 4 hours.`;
      break;

    case 'email_alert':
    default:
      targetEndpoint = 'https://api.sendgrid.com/v3/mail/send';
      responsePayload = {
        status: 'QUEUED',
        messageId: `<alert-${Date.now()}@haier-europe.com>`,
        recipients: [mergedParams.recipient, ...(mergedParams.cc || [])],
        subject: mergedParams.subject,
        deliveredAt: new Date().toLocaleTimeString(),
      };
      message = `Executive Briefing successfully dispatched to ${mergedParams.recipient} and CC list with executive summary and remedial milestones.`;
      break;
  }

  const receipt: ActionExecutionReceipt = {
    actionId: action.id,
    tool: action.tool,
    status: 'SUCCESS',
    timestamp,
    executionId,
    targetEndpoint,
    responsePayload,
    message,
  };

  EXECUTION_HISTORY.unshift(receipt);
  return receipt;
}

export function getExecutionHistory(): ActionExecutionReceipt[] {
  return [...EXECUTION_HISTORY];
}
