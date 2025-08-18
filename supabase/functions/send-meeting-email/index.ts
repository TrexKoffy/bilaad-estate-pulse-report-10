import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface MeetingEmailRequest {
  projectName: string;
  meetingDate: string;
  meetingTime: string;
  attendees: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectName, meetingDate, meetingTime, attendees }: MeetingEmailRequest = await req.json();

    console.log("Sending meeting email:", { projectName, meetingDate, meetingTime, attendees });

    const emailResponse = await resend.emails.send({
      from: "Bilaad Projects <onboarding@resend.dev>",
      to: ["Strategyforge@gmail.com"],
      subject: "New Meeting Scheduled",
      html: `
        <h1>New Meeting Scheduled</h1>
        <p><strong>Project:</strong> ${projectName}</p>
        <p><strong>Date:</strong> ${meetingDate}</p>
        <p><strong>Time:</strong> ${meetingTime}</p>
        <p><strong>Attendees:</strong> ${attendees}</p>
        
        <p>This meeting was scheduled through the Bilaad Estate Pulse Report system.</p>
        
        <p>Best regards,<br>Bilaad Projects Team</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-meeting-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);