// File: components/DisplayServerActionResponse.tsx
type DisplayServerActionResponseProps = {
  result: {
    data?: {
      message?: string;
    };
    serverError?: string;
    // ✅ Updated to perfectly match next-safe-action structure
    validationErrors?: {
      formErrors?: string[];
      fieldErrors?: Record<string, string[] | undefined>;
    };
  };
}

const MessageBox = ({
  type,
  content,
}: {
  type: 'success' | 'error',
  content: React.ReactNode,
}) => (
  <div className={`bg-accent px-4 py-2 my-2 rounded-lg ${type === 'error' ? 'text-red-500' : ''}`}>
    {content}
  </div>
)

export function DisplayServerActionResponse({ result }: DisplayServerActionResponseProps) {
  const { data, serverError, validationErrors } = result;

  return (
    <div>
      {data?.message && (
        <MessageBox type="success" content={data.message} />
      )}

      {serverError && (
        <MessageBox type="error" content={serverError} />
      )}

      {/* ✅ Unpacks next-safe-action form errors array */}
      {validationErrors?.formErrors && validationErrors.formErrors.length > 0 && (
        <MessageBox type="error" content={validationErrors.formErrors.map((err, i) => (
          <p key={i}>{err}</p>
        ))} />
      )}

      {/* ✅ Safely parses out sub-field errors matching your database columns */}
      {validationErrors?.fieldErrors && (
        <MessageBox type="error" content={Object.keys(validationErrors.fieldErrors).map((key) => {
          const errors = validationErrors.fieldErrors?.[key];
          if (!errors || errors.length === 0) return null;
          return (
            <p key={key}>
              {/* ✅ Fixed expression output mapping */}
              {key}: {errors.join(', ')}
            </p>
          );
        })} />
      )}
    </div>
  )
}
