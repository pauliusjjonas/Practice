import { Callout } from "../../../components/lesson/Callout";
import { Exercise } from "../../../components/lesson/Exercise";

export default function TheArtifactTool() {
  return (
    <>
      <p>
        Normally, when Claude writes code for you, it shows up as text in
        the chat — you'd have to copy it out and open it yourself to see
        what it actually looks like. An <strong>Artifact</strong> skips that
        step: Claude can render a web page, a diagram, or an interactive
        tool directly, right there in the conversation, as a page you can
        actually click around in.
      </p>
      <p>
        Think of the difference between someone describing a room to you and
        someone handing you a photo of it. Regular code in chat is the
        description. An Artifact is the photo — or in this case, more like a
        walk-through, since you can actually interact with it.
      </p>
      <Callout variant="tip">
        Claude tends to reach for an Artifact specifically when showing you
        something visual would be clearer than explaining it in words — a
        mockup, a dashboard, a small game, a calculator. For a one-line code
        change buried inside a much larger existing project, it'll usually
        just edit the file directly instead.
      </Callout>
      <p>
        Artifacts are private by default — only you can see one when it's
        created. You get to decide afterward whether to share it with anyone
        else.
      </p>
      <Callout variant="info">
        An Artifact is self-contained: it can't call out to the internet or
        load things from other websites. That's a deliberate safety
        boundary, similar to the sandboxed playground you'll use later in
        this module.
      </Callout>
      <Exercise
        successLooksLike={
          <>
            Instead of a wall of code in the chat, you get an actual
            rendered page — with real buttons, colors, and layout — that you
            can click and interact with.
          </>
        }
      >
        <ol>
          <li>
            In any Claude Code session, ask: "make me a simple dashboard
            mockup with 3 stat cards showing fake numbers."
          </li>
          <li>
            Notice that the result appears as an actual interactive page,
            not just a code block you'd need to run yourself.
          </li>
        </ol>
      </Exercise>
    </>
  );
}
