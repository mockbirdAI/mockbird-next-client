import prisma from "@/lib/prisma";
import { InterviewStatus, RequestStatus } from "@prisma/client";
import { NextResponse } from "next/server"

export async function POST(request: any) {
  const res = await request.json()
  const {candidateId, recruiterId, proposedTime, requestId } = res;

  // DYTE

  const dyteAuth = btoa(`${process.env.DYTE_ORG_ID}:${process.env.DYTE_API_KEY}`)

  let dyteMeetingId;
  let hostToken;
  let userToken;

  const meetingURL = 'https://api.dyte.io/v2/meetings';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${dyteAuth}`
    },
    body: '{"title":"string","preferred_region":"us-east-1","record_on_start":false,"live_stream_on_start":false,"recording_config":{"max_seconds":60,"file_name_prefix":"string","video_config":{"codec":"H264","width":1280,"height":720,"watermark":{"url":"http://stealthxi.com","size":{"width":1,"height":1},"position":"left top"},"export_file":true},"audio_config":{"codec":"AAC","channel":"stereo","export_file":true},"storage_config":{"type":"aws","access_key":"string","secret":"string","bucket":"string","region":"us-east-1","path":"string","auth_method":"KEY","username":"string","password":"string","host":"string","port":0,"private_key":"string"},"dyte_bucket_config":{"enabled":true},"live_streaming_config":{"rtmp_url":"rtmp://a.rtmp.youtube.com/live2"}}}'
  };
  
  try {
    const response = await fetch(meetingURL, options);
    const data = await response.json();
    dyteMeetingId = data.data.id;
  } catch (error) {
    console.error(error);
  }

  const addParticipantURL = `https://api.dyte.io/v2/meetings/${dyteMeetingId}/participants`;
  const addHostOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${dyteAuth}`
    },
    body: '{"name":"Interviewer","picture":"https://i.imgur.com/test.jpg","preset_name":"group_call_host","custom_participant_id":"InterviewerId"}'
  };

  const addUserOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Basic ${dyteAuth}`
    },
    body: '{"name":"Candidate","picture":"https://i.imgur.com/test.jpg","preset_name":"group_call_participant","custom_participant_id":"CandidateId"}'
  };

  try {
    const addHostResponse = await fetch(addParticipantURL, addHostOptions);
    const addUserResponse = await fetch(addParticipantURL, addUserOptions);
    const addHostData = await addHostResponse.json();
    const addUserData = await addUserResponse.json();
    hostToken = String(addHostData.data.token);
    userToken = String(addUserData.data.token);
  } catch (error) {
    console.error(error);
  }

  // END DYTE

  const result = await prisma.interview.create({
  data: {
    candidateId,
    recruiterId,
    scheduledTime: proposedTime,
    duration: 60,
    status: InterviewStatus.SCHEDULED,
    requestId,
    hostToken: hostToken,
    userToken: userToken
  }
  })

  const updateRequest = await prisma.interviewRequest.update({
  where: {
    id: requestId,
  },
  data: {
    status: RequestStatus.ACCEPTED
  }
  })

  return NextResponse.json({result, updateRequest})
}