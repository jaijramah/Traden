import { NextResponse } from 'next/server';
export async function GET(){return NextResponse.json({ok:true,demoMode:true,message:'Traden API route is ready.'})}
export async function POST(req:Request){let body=null; try{body=await req.json()}catch{} return NextResponse.json({ok:true,demoMode:true,body})}
export async function PATCH(req:Request){let body=null; try{body=await req.json()}catch{} return NextResponse.json({ok:true,demoMode:true,body})}
export async function DELETE(){return NextResponse.json({ok:true,demoMode:true})}
