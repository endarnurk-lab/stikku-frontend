import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { nama, total } = await request.json();

    // Membuat nomor pesanan unik otomatis
    const orderId = `STIKKU-${Date.now()}`;

    // CATATAN: Ini adalah Server Key Sandbox (Uji Coba) DUMMY. 
    // Nanti kita akan ganti dengan kunci rahasia dari akun Midtrans Anda.
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const authString = Buffer.from(serverKey + ':').toString('base64');

    // Data yang dikirim ke Midtrans
    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: total
      },
      customer_details: {
        first_name: nama
      }
    };

    // SAYA MENGHAPUS KATA 'sandbox.' DI SINI
    const response = await fetch('https://app.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return NextResponse.json({ token: data.token });
  } catch {
    return NextResponse.json({ error: 'Gagal membuat tagihan' }, { status: 500 });
  }
}