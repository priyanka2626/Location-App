import React from 'react';

const Pagination =({LocationPerPage,TotalEntry,Paginate})=>{
    const Pagenumbers=[];

    for(let i=1;i<=Math.ceil(TotalEntry/LocationPerPage);i++){
        Pagenumbers.push(i);
    }
    
        return(
            <nav>
                <ul className="pagination pg">
                    {Pagenumbers.map(number=>(
                        <li key={number} className="page-item">
                            <a onClick= {() => Paginate(number) }href='#' className='page-link'>
                                {number}
                            </a>
                        </li>
                    ))}
                </ul>

            </nav>
        )
}

export default Pagination;