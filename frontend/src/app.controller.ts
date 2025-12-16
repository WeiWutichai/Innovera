import { Controller, Get, Render } from '@nestjs/common';
import axios from 'axios';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  async root() {
    const backendUrl = process.env.NEXT_JS_BACKEND_URL || 'http://backend:3000';
    try {
      const response = await axios.get(`${backendUrl}/api/users`);
      return { users: response.data };
    } catch (error) {
      console.error('Error connecting to backend:', error.message);
      return { users: [] };
    }
  }
}
