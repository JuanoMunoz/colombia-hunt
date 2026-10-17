import type { ReactNode } from "react";
import {
  PRIVACY_CONTACT_EMAIL,
  PRIVACY_POLICY_VERSION,
  PRIVACY_RESPONSIBLE_NAME,
} from "../../lib/legal";

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-titulo`} className="flex flex-col gap-4">
      <h2
        id={`${id}-titulo`}
        className="text-xl font-bold tracking-tight text-(--brand) sm:text-2xl"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-base leading-7 text-(--foreground) sm:text-lg sm:leading-8">
      {children}
    </p>
  );
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 text-base leading-7 text-(--foreground) sm:text-lg sm:leading-8">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function MailLink() {
  return (
    <a
      href={`mailto:${PRIVACY_CONTACT_EMAIL}`}
      className="font-medium text-(--brand) underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand)"
    >
      {PRIVACY_CONTACT_EMAIL}
    </a>
  );
}

export default function PoliticaTratamientoContent() {
  return (
    <>
      <section
        aria-labelledby="titulo-politica"
        className="border-b border-(--brand)/10 bg-(--brand)/5"
      >
        <div className="mx-auto flex min-h-[30svh] w-full max-w-5xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 sm:py-20">
          <h1
            id="titulo-politica"
            className="max-w-3xl text-3xl font-semibold leading-10 text-(--brand) sm:text-4xl"
          >
            Política de tratamiento de datos personales
            <span className="text-(--secondary)" aria-hidden="true">
              .
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-(--foreground)/80">
            Cómo recogemos, usamos, protegemos y permitimos gestionar los datos
            personales de las personas que publican y exploran proyectos en
            Colombia Hunt.
          </p>
          <p className="mt-3 text-sm text-(--foreground)/60">
            Versión vigente desde el {PRIVACY_POLICY_VERSION}.
          </p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-12 px-4 py-12 sm:px-6 sm:py-16">
        <Section id="responsable" title="1. Responsable del tratamiento">
          <P>
            El responsable del tratamiento de los datos personales recolectados
            a través de Colombia Hunt es <strong>{PRIVACY_RESPONSIBLE_NAME}</strong>,
            persona natural, con domicilio en Colombia. Puedes escribirnos a{" "}
            <MailLink /> para cualquier asunto relacionado con tus datos
            personales.
          </P>
        </Section>

        <Section id="marco" title="2. Marco legal">
          <P>
            Esta política se expide en cumplimiento de la Constitución Política
            de Colombia (artículo 15), la Ley Estatutaria 1581 de 2012, el
            Decreto 1377 de 2013 y el Decreto 1074 de 2015 (capítulos 25 y 26),
            que desarrollan el derecho de toda persona a conocer, actualizar y
            rectificar la información que se haya recogido sobre ella en bases
            de datos.
          </P>
        </Section>

        <Section id="definiciones" title="3. Definiciones">
          <List
            items={[
              <>
                <strong>Titular:</strong> persona natural cuyos datos personales
                son objeto de tratamiento.
              </>,
              <>
                <strong>Tratamiento:</strong> cualquier operación sobre datos
                personales, como recolectar, almacenar, usar, circular o
                suprimir.
              </>,
              <>
                <strong>Autorización:</strong> consentimiento previo, expreso e
                informado del titular para tratar sus datos.
              </>,
              <>
                <strong>Responsable:</strong> quien decide sobre la base de datos
                y el tratamiento.
              </>,
            ]}
          />
        </Section>

        <Section id="datos" title="4. Datos personales que tratamos">
          <List
            items={[
              <>
                <strong>Datos de identificación y contacto:</strong> nombre,
                correo electrónico e imagen de perfil. De forma opcional, los
                enlaces a redes sociales (GitHub, LinkedIn, X/Twitter,
                Instagram) y el número de WhatsApp que decidas publicar.
              </>,
              <>
                <strong>Datos de tus proyectos:</strong> título, descripción,
                imagen, sitio web, demo, repositorio de código, ciudad y
                categorías.
              </>,
              <>
                <strong>Datos de interacción:</strong> proyectos marcados con
                “me gusta”, guardados como favoritos y los comentarios que
                publiques.
              </>,
              <>
                <strong>Datos técnicos:</strong> fecha y hora de registro,
                aceptación de esta política y versión aceptada, además de datos
                de conexión necesarios para la seguridad y el funcionamiento del
                servicio.
              </>,
            ]}
          />
        </Section>

        <Section id="finalidades" title="5. Finalidades del tratamiento">
          <List
            items={[
              "Crear y administrar tu cuenta y autenticarte de forma segura.",
              "Publicar y mostrar tus proyectos en el directorio público, incluidos los enlaces y datos que decidas compartir.",
              "Permitir interacciones como “me gusta”, favoritos y comentarios, y moderar los contenidos.",
              "Prevenir el fraude, el abuso y los usos indebidos, y garantizar la seguridad del servicio.",
              "Atender consultas, solicitudes y reclamos.",
              "Enviarte correos con proyectos interesantes u otras comunicaciones informativas, únicamente si otorgaste tu autorización expresa y separada para ello.",
            ]}
          />
        </Section>

        <Section id="autorizacion" title="6. Autorización">
          <P>
            Al marcar la casilla correspondiente y crear tu cuenta, otorgas tu
            autorización previa, expresa e informada para el tratamiento de tus
            datos conforme a esta política. La autorización para recibir correos
            con proyectos interesantes es facultativa y separada: si la rechazas,
            tu registro y el uso de la plataforma no se ven afectados. Puedes
            cambiar esa preferencia en cualquier momento desde tu perfil.
          </P>
        </Section>

        <Section id="derechos" title="7. Derechos del titular">
          <List
            items={[
              "Conocer, actualizar y rectificar tus datos personales.",
              "Solicitar prueba de la autorización otorgada, salvo las excepciones legales.",
              "Ser informado sobre el uso que se ha dado a tus datos.",
              "Solicitar la supresión de tus datos cuando proceda y revocar la autorización.",
              "Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley.",
              "Acceder de forma gratuita a tus datos personales.",
            ]}
          />
        </Section>

        <Section id="ejercer" title="8. Cómo ejercer tus derechos">
          <P>
            Envía tus consultas o reclamos a <MailLink /> indicando tu nombre,
            datos de contacto, la solicitud concreta y los documentos que quieras
            hacer valer. Las consultas se atienden dentro de los{" "}
            <strong>diez (10) días hábiles</strong> siguientes a su recepción,
            prorrogables hasta por cinco (5) días hábiles cuando sea necesario.
            Los reclamos se atienden dentro de los{" "}
            <strong>quince (15) días hábiles</strong> siguientes, prorrogables
            hasta por ocho (8) días hábiles. Si no estás conforme, puedes acudir
            a la Superintendencia de Industria y Comercio.
          </P>
        </Section>

        <Section id="terceros" title="9. Encargados y transferencia de datos">
          <P>
            Para operar la plataforma nos apoyamos en proveedores de
            infraestructura y servicios que pueden estar ubicados en Colombia o
            en el exterior: alojamiento (Vercel), base de datos (Turso),
            almacenamiento de imágenes (UploadThing), autenticación con GitHub y
            Google, y analítica (Google Tag Manager). Cuando corresponda,
            realizamos transferencias y transmisiones internacionales con
            proveedores que ofrecen garantías de seguridad y confidencialidad.
            Los enlaces y datos que publiques en tu perfil y en tus proyectos son
            de acceso público.
          </P>
        </Section>

        <Section id="seguridad" title="10. Seguridad de la información">
          <P>
            Aplicamos medidas técnicas, humanas y administrativas razonables para
            proteger tus datos y evitar su adulteración, pérdida, consulta, uso o
            acceso no autorizado. Ninguna medida es infalible, pero trabajamos
            para mantener un nivel de seguridad adecuado.
          </P>
        </Section>

        <Section id="menores" title="11. Menores de edad">
          <P>
            Colombia Hunt no está dirigida a niños, niñas y adolescentes. El
            tratamiento de sus datos está proscrito por la ley, salvo las
            excepciones legales, por lo que no deberías registrar una cuenta si
            eres menor de edad.
          </P>
        </Section>

        <Section id="baja" title="12. Baja de proyectos no acordes">
          <P>
            Nos reservamos el derecho de dar de baja o despublicar los proyectos
            que no sean acordes con el objetivo de Colombia Hunt —dar
            visibilidad al software y la tecnología hechos en el país— o que
            infrinjan la ley, esta política o derechos de terceros. La baja se
            realiza mediante un marcado lógico que deja de mostrarlos
            públicamente, y puedes solicitar la supresión de tu cuenta y de tus
            datos personales escribiendo a <MailLink />.
          </P>
        </Section>

        <Section id="vigencia" title="13. Vigencia y actualización">
          <P>
            Esta política rige a partir del {PRIVACY_POLICY_VERSION}. Si
            realizamos cambios sustanciales, los informaremos por los medios
            disponibles en la plataforma. El uso continuado del servicio después
            de una actualización implica su aceptación.
          </P>
        </Section>

        <section
          aria-labelledby="aviso-titulo"
          className="rounded-xl border border-(--brand)/15 bg-(--brand)/3 px-5 py-6"
        >
          <h2
            id="aviso-titulo"
            className="text-lg font-bold tracking-tight text-(--brand)"
          >
            Aviso de privacidad
          </h2>
          <p className="mt-3 text-base leading-7 text-(--foreground)/85">
            <strong>{PRIVACY_RESPONSIBLE_NAME}</strong> (Colombia) trata tus
            datos de cuenta, perfil, proyectos e interacciones para operar
            Colombia Hunt. Puedes escribir a <MailLink /> para conocer,
            actualizar, rectificar o suprimir tus datos, revocar tu autorización
            o presentar quejas ante la Superintendencia de Industria y Comercio.
            Consulta el detalle completo en esta política.
          </p>
        </section>
      </div>
    </>
  );
}
