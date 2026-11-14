export default class PortfolioPanel
{
    constructor(_options)
    {
        this.controls = _options.controls
        this.element = document.querySelector('.js-portfolio-panel')
        this.prompt = document.querySelector('.js-interaction-prompt')
        this.closeButton = this.element.querySelector('.js-panel-close')
        this.currentArea = null
        this.promptEntry = null
        this.isOpen = false

        this.closeButton.addEventListener('click', () =>
        {
            this.close()
        })

        this.element.addEventListener('click', (_event) =>
        {
            if(_event.target === this.element)
            {
                this.close()
            }
        })

        this.prompt.addEventListener('click', () =>
        {
            if(this.promptEntry && this.promptEntry.area)
            {
                this.open(this.promptEntry.entry, this.promptEntry.area)
            }
        })

        document.addEventListener('keydown', (_event) =>
        {
            if(this.isOpen && _event.key === 'Escape')
            {
                this.close()
            }
        })
    }

    showPrompt(_entry, _area)
    {
        this.promptEntry = { entry: _entry, area: _area }
        this.prompt.querySelector('.js-prompt-label').textContent = _entry.name
        this.prompt.querySelector('.js-prompt-action').textContent = this.controls.config.touch
            ? 'TAP TO INSPECT'
            : 'PRESS E TO INSPECT'
        this.prompt.hidden = false
    }

    hidePrompt(_entry)
    {
        if(this.promptEntry && this.promptEntry.entry === _entry)
        {
            this.promptEntry = null
            this.prompt.hidden = true
        }
    }

    open(_entry, _area)
    {
        this.currentArea = _area
        this.isOpen = true
        this.hidePrompt(_entry)

        this.element.querySelector('.js-panel-eyebrow').textContent = _entry.eyebrow || 'ENGINEERING CITY'
        this.element.querySelector('.js-panel-title').textContent = _entry.name
        this.element.querySelector('.js-panel-description').textContent = _entry.description || ''

        const contribution = this.element.querySelector('.js-panel-contribution')
        const contributionSection = this.element.querySelector('.js-panel-contribution-section')
        contribution.textContent = _entry.contribution || ''
        contributionSection.hidden = !_entry.contribution

        const highlights = this.element.querySelector('.js-panel-highlights')
        const highlightSection = this.element.querySelector('.js-panel-highlights-section')
        highlights.replaceChildren()
        for(const _highlight of _entry.highlights || [])
        {
            const item = document.createElement('li')
            item.textContent = _highlight
            highlights.appendChild(item)
        }
        highlightSection.hidden = !(_entry.highlights && _entry.highlights.length)

        const technologies = this.element.querySelector('.js-panel-technologies')
        technologies.replaceChildren()
        for(const _technology of _entry.technologies || [])
        {
            const item = document.createElement('li')
            item.textContent = _technology
            technologies.appendChild(item)
        }
        this.element.querySelector('.js-panel-technology-section').hidden = !(_entry.technologies && _entry.technologies.length)

        const links = this.element.querySelector('.js-panel-links')
        links.replaceChildren()
        for(const _link of _entry.links || [])
        {
            const anchor = document.createElement('a')
            anchor.href = _link.href
            anchor.target = '_blank'
            anchor.rel = 'noopener noreferrer'
            anchor.textContent = _link.label
            links.appendChild(anchor)
        }
        links.hidden = !(_entry.links && _entry.links.length)

        this.element.hidden = false
        this.closeButton.focus()
        this.controls.setEnabled(false)

        if(_area.car && _area.car.physics.car.chassis.body)
        {
            const body = _area.car.physics.car.chassis.body
            body.velocity.set(0, 0, 0)
            body.angularVelocity.set(0, 0, 0)
            body.sleep()
        }

        _area.deactivate()
    }

    close()
    {
        if(!this.isOpen)
        {
            return
        }

        this.isOpen = false
        this.element.hidden = true
        this.controls.setEnabled(true)

        if(this.currentArea)
        {
            if(this.currentArea.car && this.currentArea.car.physics.car.chassis.body)
            {
                this.currentArea.car.physics.car.chassis.body.wakeUp()
            }

            this.currentArea.activate()
            this.currentArea = null
        }
    }
}
