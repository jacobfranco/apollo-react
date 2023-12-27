export const mockLogin = async (email: string, password: string) => {
    // Simulate a delay like an actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    // Mock successful login (In real implementation, you would check credentials)
    if (email === "test@example.com" && password === "password123") {
      return { email, token: 'mockToken' }; // Mock response with token
    } else {
      throw new Error("Invalid credentials"); // Mock error
    }
  };
  