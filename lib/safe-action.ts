import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import * as Sentry from "@sentry/nextjs";

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      userId: z.string().optional(),
      actionName: z.string(),
    });
  },
  defaultValidationErrorsShape: "flattened", 
  handleServerError(e, utils) {
    const { clientInput, metadata } = utils;
    
    Sentry.captureException(e, (scope) => {
      scope.setContext('serverError', { message: e.message });
      
      scope.setContext('metadata', { actionName: metadata?.actionName });
      scope.setContext('clientInput', { clientInput });
      
      return scope;
    });

    if (e.constructor.name === "DatabaseError") {
      return 'Database error occurred. Please try again later.';
    }
    
    return e.message || 'An unexpected error occurred. Please try again later.';
  }
});
