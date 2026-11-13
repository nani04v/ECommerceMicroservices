

\# E-Commerce Microservices — Copilot Instructions



\## Project architecture

\- This project contains OrderService, PaymentService, ProductService, and UserService.

\- The backend uses ASP.NET Core and .NET.

\- The application uses SQL Server and Entity Framework Core where configured.

\- The frontend is a separate React application.

\- Kubernetes manifests are maintained in the k8s directory.

\- Preserve the existing service boundaries and API contracts.



\## Development rules

\- Inspect existing implementations before creating new classes or endpoints.

\- Prefer asynchronous I/O and async/await for database and HTTP operations.

\- Use dependency injection and the existing service/repository patterns.

\- Validate incoming requests and return appropriate HTTP status codes.

\- Never hardcode credentials, API keys, connection strings, or tokens.

\- Do not log passwords, authentication tokens, or sensitive customer data.

\- Keep configuration environment-specific and use Kubernetes Secrets for sensitive deployment configuration.

\- Avoid adding packages unless they are necessary.



\## Testing

\- Add or update tests for every behavior change.

\- Cover successful operations, validation failures, unauthorized access, and relevant error cases.

\- Do not remove existing tests merely to make a build pass.

\- Run the relevant tests and build before declaring a change complete.

\- Report any tests that could not be executed.



\## Frontend

\- Inspect the existing React structure and reuse its components and API clients.

\- Maintain consistent styling and responsive layouts.

\- Handle loading states, empty results, API failures, and form validation.

\- Do not expose secrets or trust client-side authorization alone.



\## AI and chatbot

\- Treat model output as untrusted input.

\- Verify user identity and authorization on the backend before returning order details.

\- Ground policy and FAQ responses in approved information.

\- Do not allow the model to execute arbitrary SQL or unrestricted service operations.

\- Use explicit, validated tools for product search and order tracking.

\- Provide safe fallback responses when information cannot be verified.



\## Kubernetes and CI/CD

\- Preserve existing working Kubernetes manifests unless a change is required.

\- Never commit credentials, PATs, tokens, or production secrets.

\- Validate deployment changes and check rollout health.

\- Do not claim deployment success without verifying the result.



\## Change workflow

1\. Inspect the affected code and dependencies.

2\. Explain the proposed change briefly.

3\. Implement the smallest complete change.

4\. Add tests and update documentation.

5\. Run build and tests.

6\. Summarize modified files, results, and any remaining issues.



