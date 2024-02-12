// import { Injectable } from '@nestjs/common';
// import axios from 'axios';
// @Injectable()
// export class OtpService {
//  async create(datas:any) {
//     console.log(datas,"data");



   



//   const headers:any = {
//         accept:'application/json',
//         'content-type':'application/json',
//         authkey:'403400AyN459sBBG652cdb9bP1'
//       }
//       const baseUrl ='https://control.msg91.com/api/v5/otp'
//       const queryParams:any ={
//         template_id:'65648d86d6fc0502dd1ab8e2',
//         mobile:`91${String(datas.mobile)}`,
//         // otp_length:4
//       }
//       const data ={
//         Param1:'var'
//       }
//       const url = `${baseUrl}?${new URLSearchParams(queryParams).toString()}`;
//       console.log(url,"actuall url");
      
    
      
//       const response = await axios.post(url, datas ,{ headers });
//       console.log(response.data,"response");
      
//     // return 'This action adds a new otp';
//   }

//   findAll() {
//     return `This action returns all otp`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} otp`;
//   }

//   update(id: number, ) {
//     return `This action updates a #${id} otp`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} otp`;
//   }
// }




   //   method: 'POST',
  //   headers: {
  //     accept: 'application/json',
  //     'content-type': 'application/json',
  //     authkey: '403400AyN459sBBG652cdb9bP1'
  //   },
  //   body: JSON.stringify({Param1: 'var'})
  // };
  
  // fetch('https://control.msg91.com/api/v5/otp?template_id=65648d86d6fc0502dd1ab8e2&mobile= ? &otp_length=4', options)
  //   .then(response => response.json())
  //   .then(response => console.log(response))
  //   .catch(err => console.error(err));






  import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class Msg91Service {
  async sendOTP(): Promise<any> {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authkey: '403400AyN459sBBG652cdb9bP1',
      },
      data: { Param1: 'var' }, // JSON.stringify not needed when using Axios
    };

    try {
      const response = await axios.post(
        'https://control.msg91.com/api/v5/otp?template_id=65648d86d6fc0502dd1ab8e2&mobile=?&otp_length=4',
        options.data,
        { headers: options.headers }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
