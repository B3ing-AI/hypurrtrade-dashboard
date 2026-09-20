import React, { useEffect, useState } from 'react';

export function createDcWrapper(name, templateRaw, logicRaw, dependencies = []) {
  return function DcWrapper(props) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
      let isMounted = true;

      function checkAndRegister() {
        if (!isMounted) return;
        if (typeof window !== 'undefined' && window.adoptParsed && window.getDC) {
          // Register dependencies first (e.g. Signal Card)
          for (const dep of dependencies) {
            window.adoptParsed(dep.name, {
              template: dep.template,
              js: dep.logic,
            });
          }

          // Register main component
          window.adoptParsed(name, {
            template: templateRaw,
            js: logicRaw,
          });

          if (isMounted) {
            setReady(true);
          }
        } else {
          setTimeout(checkAndRegister, 25);
        }
      }

      checkAndRegister();

      return () => {
        isMounted = false;
      };
    }, []);

    if (!ready) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#060f0d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#97FCE4',
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: '15px',
            letterSpacing: '0.05em',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#97FCE4',
                boxShadow: '0 0 12px #97FCE4',
                animation: 'blink 1.4s ease-in-out infinite',
              }}
            ></span>
            <span>Initializing {name}...</span>
          </div>
        </div>
      );
    }

    const Component = window.getDC(name);
    return React.createElement(Component, props);
  };
}
